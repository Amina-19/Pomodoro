//import { StatusBar } from 'expo-status-bar'; // (opcional) Para la barra de estado de iOS o Android
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
// Importación de componentes personalizados
import Titulo from './source/componentes/Titulo';
import Tiempo from './source/componentes/Tiempo';
import Boton from './source/componentes/Boton';
import Pestanas from './source/componentes/Pestanas';
// Hooks de React
import { useState } from 'react';
import { useEffect } from 'react';
// Librería de Expo para reproducir sonidos
import playSonido from './source/utilidad/playSonido';
import { enviarNotificacion } from './source/utilidad/notificaciones';

export default function App() {
  // Estado del tiempo en segundos (25 minutos iniciales)
  const [time, setTime] = useState(25 * 60);
  // Estado para saber si el temporizador está corriendo
  const [run, setRun] = useState(false);
  // Estado de la pestaña seleccionada: 0 = Pomodoro, 1 = Descanso corto, 2 = Descanso largo
  const [seleccion, setSeleccion] = useState(0);
  // Array de colores de fondo según la selección
  const colores = ["#1BE380", "violet", "orange"];

  const sonido = require("./assets/level-up-191997.mp3")

  //solicitar permisos
  const solicitarPermisosNotificaciones = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        console.log("Permiso de notificación denegado");
        return;
      }
    }
  }
  useEffect(()=> {
    solicitarPermisosNotificaciones()
  },[])

  // useEffect que se ejecuta cuando cambia el estado `run`
  useEffect(() => {
    let intervalo = null // Variable para guardar el ID del intervalo

    if (run) {
      // Si `run` está activo, arrancamos el intervalo cada 1 segundo
      intervalo = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            // Si el tiempo llega a 0 o menos, detenemos el intervalo
            clearInterval(intervalo);
            setRun(false); // Pausamos la ejecución
            playSonido(sonido) // Reproducimos sonido
            enviarNotificacion()
            return 0 // Aseguramos que no siga en negativo
          }
          return prev - 1 // Restamos 1 segundo
        });
      }, 10);
    }

    // Limpieza del intervalo cuando se desmonta o cambia `run`
    return () => clearInterval(intervalo);
  }, [run]);


  return (
    // SafeAreaView: asegura que el contenido esté dentro de un área segura (en iOS)
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[
        styles.container,
        { marginTop: Platform.OS === 'android' ? 25 : 0 }, // Acomoda margen superior en Android
        { backgroundColor: colores[seleccion] } // Cambia color de fondo según la pestaña
      ]}>
        <Titulo title="Promodoro App" /> {/* Título de la app */}
        <Tiempo time={time} /> {/* Reloj que muestra el tiempo restante */}
        <Boton run={run} setRun={setRun} /> {/* Botón para iniciar/parar el temporizador */}
        <Pestanas 
          seleccion={seleccion} 
          setSeleccion={setSeleccion} 
          setTime={setTime} 
        /> {/* Pestañas para elegir Pomodoro o descansos */}
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
})
