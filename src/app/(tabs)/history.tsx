import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator 
} from 'react-native';
import { useFocusEffect } from 'expo-router';

// 1. IMPORTAÇÕES DO CALENDÁRIO
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types'; 
import { getWorkouts } from '../../services/storage';
import { Workout } from '../../types';
import ScreenBackground from '../../components/ScreenBackground'; 
// 2. IMPORTA O TEMA DO CALENDÁRIO
import { styles, calendarTheme } from './stylesHistory'; 

// 3. CONFIGURA O CALENDÁRIO PARA PORTUGUÊS
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar.','Abr.','Mai.','Jun.','Jul.','Ago.','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['D','S','T','Q','Q','S','S'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

// Helper para pegar a data de hoje no formato YYYY-MM-DD
const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};


export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);

  // 4. NOVOS ESTADOS
  // Guarda *todos* os treinos lidos do storage
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]); 
  // Guarda apenas os treinos do dia selecionado
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  // Guarda a data selecionada (string YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  // Guarda os "pontos" (marcações) do calendário
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});


  // 5. LÓGICA DE CARREGAMENTO ATUALIZADA
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);

        const today = getTodayDateString();
        setSelectedDate(today); // Define hoje como selecionado ao carregar
        
        const savedWorkouts = await getWorkouts();
        setAllWorkouts(savedWorkouts); // Guarda todos os treinos

        // Filtra os treinos para o dia de hoje (inicial)
        const todayWorkouts = savedWorkouts.filter(w => w.date.startsWith(today));
        setFilteredWorkouts(todayWorkouts.reverse());

        // Processa as datas para marcar no calendário
        const marks: MarkedDates = {};
        savedWorkouts.forEach(workout => {
          const dateString = workout.date.split('T')[0]; 
          marks[dateString] = { marked: true, dotColor: calendarTheme.dotColor };
        });

        // Adiciona a marcação de "selecionado" ao dia de hoje
        marks[today] = { 
          ...marks[today], 
          selected: true, 
          selectedColor: calendarTheme.selectedDayBackgroundColor 
        };
        
        setMarkedDates(marks);
        setLoading(false);
      };

      loadData();
    }, [])
  );

  // 6. NOVA FUNÇÃO: Chamada ao clicar num dia
  const handleDayPress = (day: { dateString: string }) => {
    const { dateString } = day;

    // Atualiza o dia selecionado
    setSelectedDate(dateString);

    // Filtra a lista de treinos para esse dia
    const newFilteredWorkouts = allWorkouts.filter(w => w.date.startsWith(dateString));
    setFilteredWorkouts(newFilteredWorkouts.reverse());

    // Atualiza as marcações (pontos) para mostrar o novo dia selecionado
    const newMarks: MarkedDates = {};
    allWorkouts.forEach(workout => {
      const dString = workout.date.split('T')[0]; 
      newMarks[dString] = { marked: true, dotColor: calendarTheme.dotColor };
    });

    newMarks[dateString] = { 
      ...newMarks[dateString], 
      selected: true, 
      selectedColor: calendarTheme.selectedDayBackgroundColor 
    };
    
    setMarkedDates(newMarks);
  };


// 7. RENDERIZAÇÃO DO ITEM (COM DATA E HORA)
  const renderWorkoutItem = ({ item }: { item: Workout }) => {
    
    // Criamos um objeto Date a partir da string do storage
    const workoutDate = new Date(item.date);

    // Formatamos a parte da DATA (ex: "22 de outubro de 2025")
    const datePart = workoutDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });

    // Formatamos a parte da HORA (ex: "15:30")
    const timePart = workoutDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Formato 24h
    });

    // Criamos a string final que você pediu
    const fullDateString = `${datePart}, às ${timePart}:`;

    return (
      <View style={styles.workoutCard}>
        {/* Usamos a nova string formatada aqui */}
        <Text style={styles.workoutDate}>
          {fullDateString}
        </Text>
        
        {item.exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            {exercise.sets.map((set, setIndex) => (
              <Text key={setIndex} style={styles.setText}>
                - Série {setIndex + 1}: {set.reps} reps com {set.weight} kg
              </Text>
            ))}
          </View>
        ))}
      </View>
    );
  };

  // Ecrã de loading (sem mudanças)
  if (loading) {
    return (
      <ScreenBackground>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#FFD60A" />
        </View>
      </ScreenBackground>
    );
  }

  // 8. RENDERIZAÇÃO PRINCIPAL
  return (
    <ScreenBackground>
      {/* Usamos FlatList como o componente raiz (sem View) 
        para que tudo (título, calendário, lista) role junto.
      */}
      <FlatList
        data={filteredWorkouts} // <-- USA A LISTA FILTRADA
        keyExtractor={(item) => item.id}
        renderItem={renderWorkoutItem}
        contentContainerStyle={styles.listContainer}

        // --- CABEÇALHO DA LISTA ---
        ListHeaderComponent={
          <>
            <Text style={styles.screenTitle}>
              Seu histórico de treinos:
            </Text>

            <Calendar
              theme={calendarTheme}
              onDayPress={handleDayPress}
              markedDates={markedDates}
              current={selectedDate} // Garante que o calendário mostre o mês selecionado
            />
          </>
        }

        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Nenhum treino registrado para este dia.</Text>
          </View>
        }
      />
    </ScreenBackground>
  );
}