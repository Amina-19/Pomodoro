import { StyleSheet, Text, View } from "react-native";
//siempre que uso algo lo tengo que importar
//componente
export default function Titulo({title}) {
    //logica del componenete
  return (
    <View >
        <Text style={styles.texto}>{title}</Text>
    </View>
    //siempre que quiera poner codigo le meto llaves {}
  );
}

//creando elemento, objeto, estilos
const styles= StyleSheet.create({
    texto: {
        fontSize:30,
        fontWeight:"bold",
        color:"white",

    }
})