import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, globalStyles } from '../constants/theme';

export default function BootScreen({ navigation }) {
  const [text, setText] = useState('');
  const fullText = `
> INITIALIZING DROPZONE SYSTEM...
> LOADING GPS MODULE... OK
> CONNECTING TO SATELLITE... OK
> DECRYPTING SECRET DATA... OK
>
> WELCOME TO THE ZONE.
  `;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
        setTimeout(() => {
          navigation.replace('Main'); // アプリのメイン画面へ遷移
        }, 1000);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [navigation, fullText]);

  return (
    <View style={styles.container}>
      <Text style={[globalStyles.textPixel, styles.terminalText]}>
        {text}
        <Text style={styles.cursor}>_</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // 真っ黒な背景
    padding: 20,
    justifyContent: 'center',
  },
  terminalText: {
    color: colors.cyan,
    fontSize: 16,
    lineHeight: 24,
  },
  cursor: {
    color: colors.magenta,
  }
});
