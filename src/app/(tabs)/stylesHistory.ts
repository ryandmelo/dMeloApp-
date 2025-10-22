import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', 
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  screenTitle: {
    fontSize: 22, 
    fontWeight: 'bold',
    color: '#FFFFFF',      
    marginBottom: 20,   
    textAlign: 'center',
    paddingTop: 10,     
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 18,
  },
  workoutCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  workoutDate: {
    color: '#FFD60A',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseItem: {
    marginLeft: 10,
    marginBottom: 5,
  },
  exerciseName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  setText: {
    color: '#DDD',
    fontSize: 14,
  },
});