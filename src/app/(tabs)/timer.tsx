import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../components/Button';

const DEFAULT_TIME = 90; // 90 segundos (1:30)

export default function TimerScreen() {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Aqui você poderia adicionar um som de alerta
    }
    
    // Limpa o intervalo quando o componente é desmontado ou o timer para
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(DEFAULT_TIME);
  };

  // Formata o tempo para "MM:SS"
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timer de Descanso</Text>
      <View style={styles.timerCircle}>
        <Text style={styles.timerText}>{formatTime()}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={isActive ? 'Pausar' : 'Iniciar'}
          onPress={toggleTimer}
          primary={!isActive}
        />
        <Button title="Resetar" onPress={resetTimer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 40,
  },
  timerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 5,
    borderColor: '#FFD60A',
  },
  timerText: {
    color: '#FFF',
    fontSize: 64,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});