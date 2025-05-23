// source/componentes/Pestanas.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Pestanas({ seleccion, setSeleccion }) {
  // Los valores de tiempo ahora los maneja App.js a través de setSeleccion
  const opciones = ["Pomodoro", "Descanso Corto", "Descanso Largo"];

  return (
    <View style={styles.container}>
      {opciones.map((opcion, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => setSeleccion(index)} // Llama a handlePestanaChange de App.js
          style={[
            styles.tab,
            seleccion === index && styles.selectedTab,
          ]}
        >
          <Text style={[styles.tabText, seleccion === index && styles.selectedTabText]}>
            {opcion}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    marginBottom: 20,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 15,
  },
  selectedTab: {
    backgroundColor: 'white',
  },
  tabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedTabText: {
    color: 'black',
  },
});