import React, { useState, useEffect, useRef } from 'react'; // Añadimos useRef para referencias mutables
import { Platform, SafeAreaView, StyleSheet, Text, View, AppState, Button } from 'react-native'; // Añadimos AppState y Button para el botón de Reiniciar
import * as Notifications from 'expo-notifications'; // Importamos todo de Notifications para usar sus métodos

// Importación de componentes personalizados
import Titulo from './source/componentes/Titulo';
import Tiempo from './source/componentes/Tiempo';
import Boton from './source/componentes/Boton'; // Este botón se usará para Iniciar/Pausar
import Pestanas from './source/componentes/Pestanas';

// Librería de Expo para reproducir sonidos - ¡Esta importación se mantiene igual!
import playSonido from './source/utilidad/playSonido';
// La función enviarNotificacion de tu utilidad ya no es necesaria aquí,
// ya que la lógica de notificación se manejará directamente con expo-notifications
// import { enviarNotificacion } from './source/utilidad/notificaciones'; 

// --- Configuración de Notificaciones (fuera del componente App) ---
// Configura cómo se manejarán las notificaciones cuando la app esté en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Mostrar alerta si la app está en primer plano
    shouldPlaySound: true, // Reproducir sonido
    shouldSetBadge: false, // No modificar el número de insignias
  }),
});

export default function App() {
  // Estado del tiempo en segundos (25 minutos iniciales)
  const [time, setTime] = useState(25 * 60);
  // Estado para saber si el temporizador está corriendo
  const [run, setRun] = useState(false);
  // Estado de la pestaña seleccionada: 0 = Pomodoro, 1 = Descanso corto, 2 = Descanso largo
  const [seleccion, setSeleccion] = useState(0);
  // Array de colores de fondo según la selección
  const colores = ["#1BE380", "violet", "orange"];

  // La referencia al sonido se mantiene exactamente igual
  const sonido = require("./assets/level-up-191997.mp3");

  // --- Nuevas referencias para manejar el estado de la aplicación en segundo plano ---
  const appState = useRef(AppState.currentState); // Para rastrear el estado de la aplicación (active, background, inactive)
  const lastBackgroundTime = useRef(0); // Para guardar el timestamp cuando la app va al fondo

  // --- Funciones de Notificación ---
  // Función para solicitar permisos de notificación
  const solicitarPermisosNotificaciones = async () => {
    const { status } = await Notifications.requestPermissionsAsync(); // Pedimos permisos directamente
    if (status !== "granted") {
      console.log("Permiso de notificación denegado");
      alert('¡Necesitamos permisos de notificación para que tu Pomodoro funcione correctamente en segundo plano!');
    }
  };

  // Función para programar una notificación local
  async function schedulePomodoroNotification(delayInSeconds, title, body) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: 'default', // Puedes usar un sonido personalizado
      },
      trigger: {
        seconds: delayInSeconds,
      },
    });
  }

  // --- useEffect para solicitar permisos al inicio de la app ---
  useEffect(() => {
    solicitarPermisosNotificaciones();
  }, []); // Se ejecuta solo una vez al montar el componente

  // --- useEffect principal para la lógica del temporizador y AppState ---
  useEffect(() => {
    let intervalo = null; // Variable para guardar el ID del intervalo

    // Manejo de AppState (cuando la app cambia de primer plano a segundo plano y viceversa)
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // La app volvió al primer plano
        console.log('App ha vuelto al primer plano!');
        const backgroundDuration = Date.now() - lastBackgroundTime.current; // Duración en milisegundos
        if (run) { // Si el temporizador estaba corriendo antes de ir a segundo plano
          // Ajusta el tiempo restante restando los segundos transcurridos en segundo plano
          const secondsElapsedInBackground = Math.round(backgroundDuration / 1000);
          setTime(prevTime => Math.max(0, prevTime - secondsElapsedInBackground));
        }
      }
      if (nextAppState.match(/inactive|background/)) {
        // La app se fue a segundo plano
        console.log('App se fue a segundo plano!');
        lastBackgroundTime.current = Date.now(); // Guarda el timestamp
      }
      appState.current = nextAppState; // Actualiza el estado actual de la app
    });

    // Lógica del temporizador cuando la app está en primer plano
    if (run) {
      intervalo = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) { // Si el tiempo llega a 0 o menos
            clearInterval(intervalo); // Detiene el intervalo
            setRun(false); // Pausa la ejecución
            playSonido(sonido); // <-- ¡La llamada a playSonido(sonido) se mantiene aquí!
            // La notificación ya se programó al iniciar el temporizador, no la disparamos aquí de nuevo
            return 0; // Asegura que el tiempo no sea negativo
          }
          return prev - 1; // Resta 1 segundo
        });
      }, 1000); // <-- ¡Cambiado a 1000 ms (1 segundo) para un temporizador preciso!
    } else {
      clearInterval(intervalo); // Si `run` es falso, detiene el intervalo
      // Cuando el temporizador se detiene (pausa o reinicio), cancela cualquier notificación pendiente
      Notifications.cancelAllScheduledNotificationsAsync();
    }

    // Función de limpieza del useEffect
    return () => {
      subscription.remove(); // Desuscribirse de los eventos de AppState
      clearInterval(intervalo); // Limpiar el intervalo para evitar fugas de memoria
    };
  }, [run, time]); // Dependencias: run y time (para que el efecto reaccione a sus cambios)

  // --- Funciones para manejar el inicio/pausa/reinicio del temporizador ---
  const handleStartStop = () => {
    const newRunState = !run;
    setRun(newRunState);

    if (newRunState) { // Si el temporizador se va a iniciar
      // Programa la notificación para cuando el tiempo actual termine
      schedulePomodoroNotification(
        time, // Usa el 'time' actual para la duración de la notificación
        seleccion === 0 ? "¡Pomodoro Terminado!" : "¡Descanso Terminado!",
        seleccion === 0 ? "Es hora de tu merecido descanso." : "Es hora de volver a la acción. ¡Anímate!"
      );
    } else { // Si el temporizador se va a pausar
      Notifications.cancelAllScheduledNotificationsAsync(); // Cancela notificaciones pendientes
    }
  };

  const handleReset = () => {
    setRun(false); // Detiene el temporizador
    setTime(25 * 60); // Restablece el tiempo a 25 minutos
    setSeleccion(0); // Vuelve a la pestaña de Pomodoro por defecto
    Notifications.cancelAllScheduledNotificationsAsync(); // Cancela notificaciones pendientes
  };

  // Función para manejar el cambio de pestaña y reiniciar el temporizador
  const handlePestanaChange = (index) => {
    setSeleccion(index);
    setRun(false); // Detiene el temporizador al cambiar de pestaña
    Notifications.cancelAllScheduledNotificationsAsync(); // Cancela notificaciones pendientes

    // Establece el tiempo según la pestaña seleccionada
    if (index === 0) { // Pomodoro
      setTime(25 * 60);
    } else if (index === 1) { // Descanso corto
      setTime(5 * 60);
    } else if (index === 2) { // Descanso largo
      setTime(15 * 60);
    }
  };

  return (
    // SafeAreaView: asegura que el contenido esté dentro de un área segura (en iOS)
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[
        styles.container,
        { marginTop: Platform.OS === 'android' ? 25 : 0 }, // Acomoda margen superior en Android
        { backgroundColor: colores[seleccion] } // Cambia color de fondo según la pestaña
      ]}>
        <Titulo title="Promodoro App" /> {/* Título de la app */}
        <Pestanas
          seleccion={seleccion}
          setSeleccion={handlePestanaChange} // Usamos nuestra nueva función para el cambio de pestaña
          // setTime ya no es necesario pasarlo directamente aquí, ya que handlePestanaChange lo maneja
        /> {/* Pestañas para elegir Pomodoro o descansos */}
        <Tiempo time={time} /> {/* Reloj que muestra el tiempo restante */}
        {/* Usamos handleStartStop para el botón de iniciar/parar */}
        <Boton run={run} setRun={handleStartStop} /> {/* Botón para iniciar/parar el temporizador */}
        {/* Añadimos un botón de Reiniciar, ya que no estaba en tu código original */}
        <Button title="Reiniciar" onPress={handleReset} />
      </View>
    </SafeAreaView>
  );
}

// Estilos para el contenedor principal
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el alto disponible
    padding: 35, // Espaciado interior
    justifyContent: 'center', // Centrado vertical
  }
});