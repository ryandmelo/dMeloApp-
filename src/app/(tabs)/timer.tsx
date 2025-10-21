import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Vibration,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Button from '../../components/Button';
import ScreenBackground from '../../components/ScreenBackground'; // <-- 1. IMPORTAR

const DEFAULT_TIME = 90;

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function TimerScreen() {
  const [duration, setDuration] = useState(DEFAULT_TIME);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [minutesString, setMinutesString] = useState('01');
  const [secondsString, setSecondsString] = useState('30');
  
  const secondsInputRef = useRef<TextInput>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      Vibration.vibrate(1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (isEditing) handleSaveTimeInput();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    if (isEditing) handleSaveTimeInput();
    setIsActive(false);
    setTimeLeft(duration);
  };

  const adjustTime = (amount: number) => {
    if (isActive || isEditing) return;

    setDuration((prevDuration) => {
      let newDuration = prevDuration + amount;
      if (newDuration < 15) newDuration = 15; 
      
      setTimeLeft(newDuration);
      return newDuration;
    });
  };

  const handleStartEditing = () => {
    if (isActive) return;
    
    const currentMinutes = Math.floor(duration / 60);
    const currentSeconds = duration % 60;
    
    setMinutesString(currentMinutes.toString().padStart(2, '0'));
    setSecondsString(currentSeconds.toString().padStart(2, '0'));
    setIsEditing(true);
  };

  const handleSaveTimeInput = () => {
    const minutes = parseInt(minutesString) || 0;
    const seconds = parseInt(secondsString) || 0;
    
    let totalSeconds = (minutes * 60) + seconds;

    if (totalSeconds < 15) {
      totalSeconds = 15;
    }
    
    setDuration(totalSeconds);
    setTimeLeft(totalSeconds);
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const handleMinutesChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setMinutesString(numericText);
    
    if (numericText.length === 2) {
      secondsInputRef.current?.focus();
    }
  };

  const handleSecondsChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (parseInt(numericText) > 59) {
      setSecondsString('59');
    } else {
      setSecondsString(numericText);
    }

    if (numericText.length === 2) {
      Keyboard.dismiss();
    }
  };

  return (
    <ScreenBackground>
      <TouchableWithoutFeedback onPress={() => {
        if (isEditing) {
          handleSaveTimeInput();
        } else {
          Keyboard.dismiss();
        }
      }}>
        <View style={styles.container}>
          {/* O <Text> do título foi removido no passo anterior */}

          <View style={styles.timerCircle}>
            {isEditing ? (
              <View style={styles.editingContainer}>
                <TextInput
                  style={styles.timerTextInput}
                  value={minutesString}
                  onChangeText={handleMinutesChange}
                  autoFocus={true}
                  keyboardType="numeric"
                  maxLength={2}
                  selectTextOnFocus
                />
                <Text style={styles.timerColon}>:</Text>
                <TextInput
                  ref={secondsInputRef}
                  style={styles.timerTextInput}
                  value={secondsString}
                  onChangeText={handleSecondsChange}
                  keyboardType="numeric"
                  maxLength={2}
                  selectTextOnFocus
                />
              </View>
            ) : (
              <TouchableOpacity onPress={handleStartEditing}>
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={isActive ? 'Pausar' : 'Iniciar'}
              onPress={toggleTimer}
              primary={!isActive}
            />
            <Button title="Resetar" onPress={resetTimer} />
          </View>

          <View style={styles.setupSection}>
            <Text style={styles.setupTitle}>Ajustar Tempo</Text>
            <View style={styles.setupContainer}>
              <Button 
                title="- 15s" 
                onPress={() => adjustTime(-15)} 
                small 
                disabled={isEditing || isActive}
              />
              <Text style={styles.durationText}>{formatTime(duration)}</Text>
              <Button 
                title="+ 15s" 
                onPress={() => adjustTime(15)} 
                small 
                disabled={isEditing || isActive}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // <-- 3. ALTERAR BACKGROUND
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // [ ... todos os seus outros estilos ... ]
  // (Nenhuma mudança nos outros estilos)
  timerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
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