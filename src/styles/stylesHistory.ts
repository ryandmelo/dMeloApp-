import { StyleSheet } from 'react-native';
import { Theme } from 'react-native-calendars/src/types';

// Cores do tema
const colors = {
  background: '#000000', 
  card: '#1C1C1E',
  text: '#FFFFFF',
  primary: '#FFD60A', 
  gray: '#8E8E93',
  disabledGray: '#444444' 
};

// Definição dos estilos visuais
const historyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', 
  },
  // Estilo para o container de carregamento (previne erro undefined)
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  // --- ESPAÇADOR DO CALENDÁRIO ---
  calendarSpacer: {
    height: 30, // Ajuste este valor para aumentar/diminuir a distância
    backgroundColor: 'transparent',
  },
  // -------------------------------
  emptyText: {
    color: colors.gray,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
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

// Definição do Tema do Calendário
export const calendarTheme: Theme = {
  backgroundColor: colors.background,
  calendarBackground: colors.card,
  textSectionTitleColor: colors.primary, 
  selectedDayBackgroundColor: colors.primary,
  selectedDayTextColor: colors.background, 
  todayTextColor: colors.primary,
  dayTextColor: colors.text,
  textDisabledColor: colors.disabledGray,
  dotColor: colors.primary,
  selectedDotColor: colors.background,
  arrowColor: colors.primary,
  disabledArrowColor: colors.disabledGray,
  monthTextColor: colors.text,
  indicatorColor: colors.primary,
  textDayFontWeight: '300',
  textMonthFontWeight: 'bold',
  textDayHeaderFontWeight: '300',
  textDayFontSize: 16,
  textMonthFontSize: 18,
  textDayHeaderFontSize: 14,
};

// Exportação Padrão
export default historyStyles;