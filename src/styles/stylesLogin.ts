import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD60A',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 22,
    color: '#FFF',
    marginBottom: 40,
  },
  buttonGroup: {
    width: '100%',
    marginTop: 10,
    position: 'relative',
  },
  loading: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  toggleText: {
    color: '#8E8E93',
    marginTop: 20,
    fontSize: 14,
  },
  forgotButton: {
    marginTop: 15,
    padding: 5,
  },
  forgotText: {
    color: '#FFD60A', 
    fontSize: 14,
    textDecorationLine: 'underline', 
  }
});

// Exporta por padrão para que o login.tsx possa importá-lo
export default styles;