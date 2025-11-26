import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  Alert, 
  StyleSheet
} from 'react-native';
import { useFocusEffect } from 'expo-router';

// Importações
import { Calendar, LocaleConfig, DateData } from 'react-native-calendars';
import { getWorkouts } from '../../services/storage';
import { Workout } from '../../types';
import ScreenBackground from '../../components/ScreenBackground'; 
import { useAuth } from '../../context/AuthContext'; 

// Importação dos estilos (Sem a extensão .ts, já que funcionou para você)
import styles, { calendarTheme } from '../../styles/stylesHistory'; 

// Definição local de tipos
type MarkedDates = {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
  };
};

// Configuração Locale
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar.','Abr.','Mai.','Jun.','Jul.','Ago.','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['D','S','T','Q','Q','S','S'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

export default function HistoryScreen() {
  const { user } = useAuth(); 
  const [loading, setLoading] = useState(true);

  // Estados de Dados
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]); 
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  // --- DADOS DERIVADOS (Otimização com useMemo) ---
  
  // 1. Lista Filtrada: Atualiza automaticamente
  const filteredWorkouts = useMemo(() => {
    return allWorkouts
      .filter(w => w.date.split('T')[0] === selectedDate)
      .reverse();
  }, [allWorkouts, selectedDate]);

  // 2. Marcas do Calendário: Atualiza automaticamente
  const markedDates = useMemo(() => {
    const marks: MarkedDates = {};
    const dotColor = calendarTheme?.dotColor || '#FFD60A';
    const selectedBg = calendarTheme?.selectedDayBackgroundColor || '#FFD60A';

    // Marca dias com treino
    allWorkouts.forEach(workout => {
      const dateString = workout.date.split('T')[0]; 
      marks[dateString] = { marked: true, dotColor: dotColor };
    });

    // Marca dia selecionado
    marks[selectedDate] = { 
      ...(marks[selectedDate] || {}), 
      selected: true, 
      selectedColor: selectedBg 
    };

    return marks;
  }, [allWorkouts, selectedDate]);


  // --- CARREGAMENTO ---
  const loadData = useCallback(async () => {
    if (!user || !user.uid) {
        setLoading(false);
        return;
    }
    
    setLoading(true);

    try {
        // Busca tudo de uma vez
        const savedWorkouts = await getWorkouts(user.uid); 
        setAllWorkouts(savedWorkouts); 
    } catch(e) {
        console.error("Erro ao carregar dados: ", e);
        Alert.alert("Erro", "Não foi possível carregar o histórico.");
    } finally {
        setLoading(false);
    }
  }, [user]); 

  useFocusEffect(
    useCallback(() => {
        loadData();
    }, [loadData]) 
  );

  // --- INTERAÇÃO ---
  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  // --- RENDERIZAÇÃO ---
  const renderWorkoutItem = ({ item }: { item: Workout }) => {
    const workoutDate = new Date(item.date);
    const timePart = workoutDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
    const datePart = workoutDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' });
    const fullDateString = `${datePart}, às ${timePart}:`;

    if (!styles) return null;

    return (
      <View style={styles.workoutCard}>
        <Text style={styles.workoutDate}>{fullDateString}</Text>
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

  if (loading) {
    return (
      <ScreenBackground>
        {/* Usa o estilo loadingContainer para centralizar */}
        <View style={styles?.loadingContainer || {flex:1, justifyContent:'center'}}>
          <ActivityIndicator size="large" color="#FFD60A" />
        </View>
      </ScreenBackground>
    );
  }

  if (!styles) return null;

  return (
    <ScreenBackground>
      <View style={styles.container}> 
        <FlatList
          data={filteredWorkouts} 
          keyExtractor={(item) => item.id}
          renderItem={renderWorkoutItem}
          contentContainerStyle={styles.listContainer}

          ListHeaderComponent={
            <>
              <Text style={styles.screenTitle}>
                {selectedDate === getTodayDateString() ? 'Treinos de Hoje:' : `Treinos em: ${selectedDate}`}
              </Text>

              <Calendar
                theme={calendarTheme}
                onDayPress={handleDayPress}
                markedDates={markedDates}
                current={selectedDate} 
                enableSwipeMonths={true}
                hideExtraDays={true}
              />
              
              {/* USO DO ESTILO ORGANIZADO PARA O ESPAÇAMENTO */}
              <View style={styles.calendarSpacer} />
            </>
          }

          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Nenhum treino registrado para este dia.</Text>
            </View>
          }
        />
      </View>
    </ScreenBackground>
  );
}