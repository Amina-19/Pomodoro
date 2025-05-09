import { StyleSheet, Text, View } from "react-native";

// Función auxiliar que convierte los segundos en formato MM:SS
function formatearTiempo(segundos) {
  const minutos = Math.floor(segundos / 60);              // Calcula los minutos enteros
  const restoSegundos = segundos % 60;                    // Calcula los segundos restantes
  const formatoMin = minutos < 10 ? `0${minutos}` : minutos;  // Formato con cero adelante si es < 10
  const formatoSeg = restoSegundos < 10 ? `0${restoSegundos}` : restoSegundos; // Igual para los segundos
  return `${formatoMin}:${formatoSeg}`;                   // Devuelve string con formato tipo reloj
}

// Componente visual que muestra el tiempo en pantalla
export default function Tiempo({ time }) {
  return (
    <View style={styles.conteiner}> {/* Caja blanca contenedora */}
      <Text style={styles.texto}>{formatearTiempo(time)}</Text> {/* Texto con el tiempo formateado */}
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  conteiner: {
    backgroundColor: "white",    // Fondo blanco
    height: 200,                 // Alto fijo de 200
    borderRadius: 10,            // Bordes redondeados
    justifyContent: 'center',   // Centrado vertical del contenido
    alignItems: 'center',       // Centrado horizontal del contenido
    marginTop: 15,              // Margen superior
  },
  texto: {
    color: 'black',             // Color del texto
    fontSize: 50,               // Tamaño grande de fuente
  }
});
