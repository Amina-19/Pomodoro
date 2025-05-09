import { Audio } from "expo-av";
// Función asincrónica para reproducir el sonido
async function playSonido(sonido) {
    const { sound } = await Audio.Sound.createAsync(
        sonido // Reproduce el sonido pasado por parametros
    );
    await sound.playAsync(); // Reproducir sonido
}

export default playSonido