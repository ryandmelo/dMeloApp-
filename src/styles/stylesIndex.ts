import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  // NOVOS ESTILOS PARA O LOGOUT
  logoutContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    alignItems: 'flex-end',
  },
  logoutButton: {
    backgroundColor: '#3A3A3C',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  // ESTILOS DA TELA DE TREINO
  addExerciseContainer: {
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  exerciseContainer: {
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD60A',
    flex: 1,
  },
  editInput: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    color: '#FFF',
    padding: 8,
    borderRadius: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#D11A2A',
    marginLeft: 5,
  },
  setContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  setText: {
    color: '#FFF',
    fontSize: 16,
    flex: 0.25,
  },
  setInput: {
    flex: 0.3,
    marginHorizontal: 2,
  },
  deleteSetButton: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  deleteSetText: {
    color: '#D11A2A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 10,
  },
});

// ESTA LINHA É ESSENCIAL para que o 'import styles...' funcione!
export default styles;