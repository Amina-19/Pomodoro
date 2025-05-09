import { StyleSheet, Pressable, Text, View } from "react-native";

// Componente de pestañas que permite cambiar entre modos Pomodoro / Descansos
export default function Pestanas(props) {
  const { seleccion, setSeleccion, setTime } = props; // Recibe la pestaña seleccionada y funciones para cambiarla y cambiar el tiempo

  // Arreglo con los nombres de las pestañas
  const opciones = ["Pomodoro", "Descanso corto", "Descanso Largo"];

  // Cambia la pestaña seleccionada y ajusta el tiempo según la opción
  function cambiarSeleccion(index) {
    setSeleccion(index); // Cambia la pestaña activa

    // Cambia el tiempo base según la opción elegida
    if (index === 0) setTime(25 * 60);      // Pomodoro = 25 minutos
    else if (index === 1) setTime(5 * 60);  // Descanso corto = 5 minutos
    else if (index === 2) setTime(15 * 60); // Descanso largo = 15 minutos
  }

  return (
    <View style={styles.container}> {/* Contenedor horizontal para las pestañas */}
      {opciones.map((opcion, index) => (
        <Pressable
          key={index} // Clave única para cada pestaña
          style={[
            styles.pressable,                  // Estilo base del botón
            seleccion === index && styles.seleccionado // Si está seleccionada, aplica estilo extra
          ]}
          onPress={() => cambiarSeleccion(index)} // Cuando se presiona, cambia la selección
        >
          <Text style={styles.texto}>{opcion}</Text> {/* Muestra el nombre de la opción */}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 100,
  },
  pressable: {
    borderRadius: 5,
    marginRight: 10,
    padding: 5,
  },
  seleccionado: {
    borderWidth: 2,
    borderColor: "black",
  },
  texto: {
    fontSize: 20,
    color: "black",
  },
});