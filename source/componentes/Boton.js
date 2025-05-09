import { StyleSheet, Text, View, Pressable } from "react-native";
import playSonido from "../utilidad/playSonido";

// Componente Boton que inicia o detiene el temporizador
export default function Boton(props) {
  const { run, setRun } = props; // Desestructuramos las props: `run` indica si el timer está corriendo
  const sonido = require("../../assets/mario-bros tuberia.mp3")
  // Función que cambia el estado de ejecución del temporizador
  function cambiarEstado() {
    setRun(prevRun => !prevRun); // Cambia el estado de `run` (de true a false o viceversa)
    playSonido(sonido)// Reproduce sonido al presionar
  }
    

  return (
    <View style={styles.conteiner}> {/* Caja contenedora del botón */}
      <Pressable onPress={cambiarEstado}> {/* Cuando se presiona, se cambia el estado y suena */}
        <Text style={styles.texto}>
          {run ? "Parar" : "Iniciar"} {/* El texto cambia según si `run` está en true o false */}
        </Text>
      </Pressable>
    </View>
  );
}

// Estilos para el botón
const styles = StyleSheet.create({
  conteiner: {
    backgroundColor: "white",     // Fondo blanco
    height: 55,                   // Altura del botón
    borderRadius: 20,             // Bordes redondeados
    borderBlockColor: 'black',    // Color del borde (podrías cambiar esto por `borderColor`)
    borderWidth: 2,               // Grosor del borde
    justifyContent: 'center',     // Centrado vertical
    alignItems: 'center',         // Centrado horizontal
    marginTop: 25,                // Separación con el componente superior
  },
  texto: {
    color: 'black',               // Color del texto
    fontSize: 45,                 // Tamaño grande de fuente
  }
});
