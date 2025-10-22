import { StyleSheet } from 'react-native';
// 1. IMPORTAMOS O TIPO 'Theme' DA BIBLIOTECA
import { Theme } from 'react-native-calendars/src/types';

// Vamos definir as nossas cores principais para o tema
const colors = {
  background: '#000000', // Assumindo fundo preto do ScreenBackground
  card: '#1C1C1E',
  text: '#FFFFFF',
  primary: '#FFD60A', // Seu amarelo
  gray: '#8E8E93',
  disabledGray: '#444444' // Um cinza mais escuro para dias desativados
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', 
  },
  center: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  screenTitle: {
    fontSize: 22, 
    fontWeight: 'bold',
    color: colors.text,      
    marginBottom: 10,
    textAlign: 'center',
    paddingTop: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 20,
    marginBottom: 10,
  },
  emptyText: {
    color: colors.gray,
    fontSize: 18,
    textAlign: 'center',
  },
  workoutCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  workoutDate: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 0,
    flex: 1,
  },
  exerciseItem: {
    marginLeft: 10,
    marginBottom: 5,
  },
  exerciseName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  setText: {
    color: '#DDD',
    fontSize: 14,
  },
  
});

// NOVO: Tema para o componente Calendário
// 2. ADICIONAMOS O TIPO ': Theme' AQUI
export const calendarTheme: Theme = {
  backgroundColor: colors.background,
  calendarBackground: colors.background,
  textSectionTitleColor: colors.gray,
  selectedDayBackgroundColor: colors.primary,
  selectedDayTextColor: colors.background, // Texto preto no dia selecionado
  todayTextColor: colors.primary,
  dayTextColor: colors.text,
  textDisabledColor: colors.disabledGray,
  dotColor: colors.primary,
  selectedDotColor: colors.background,
  arrowColor: colors.primary,
  disabledArrowColor: colors.disabledGray,
  monthTextColor: colors.text,
  indicatorColor: colors.primary,
  // Estes são opcionais mas ajudam na consistência
  textDayFontWeight: '300',
  textMonthFontWeight: 'bold',
  textDayHeaderFontWeight: '300',
  textDayFontSize: 16,
  textMonthFontSize: 18,
  textDayHeaderFontSize: 14,
};