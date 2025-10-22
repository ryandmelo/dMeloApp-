import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  timerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#FFD60A',
  },
  timerText: {
    color: '#FFF',
    fontSize: 64,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerTextInput: {
    color: '#FFF',
    fontSize: 64,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 90,
  },
  timerColon: {
    color: '#FFF',
    fontSize: 56,
    fontWeight: 'bold',
    marginHorizontal: -5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 30,
  },
  setupSection: {
    marginTop: 60,
    alignItems: 'center',
  },
  setupTitle: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 10,
  },
  setupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
  },
  durationText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    width: 80, 
    textAlign: 'center',
  },
});