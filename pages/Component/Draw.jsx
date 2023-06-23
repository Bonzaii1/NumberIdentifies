import styles from '../../styles/Home.module.css';
import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

export default function Draw() {
  const [guess, setGuess] = useState();
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth / 4}px`;
    canvas.style.height = `${window.innerHeight / 2}px`;
    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 20;
    contextRef.current = context;
  }, []);

  useEffect(() => {}, [guess]);
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);

    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const evaluate = async () => {
    //import model
    const model = await tf.loadLayersModel(
      'https://raw.githubusercontent.com/Bonzaii1/NumericPrediction/main/Model/model.json'
    );

    //set image to a variable
    const canvas = canvasRef.current;
    let image = new Image(28, 28);
    var resizedCanvas = document.createElement('canvas');
    var resizedContext = resizedCanvas.getContext('2d');
    resizedCanvas.height = '28';
    resizedCanvas.width = '28';

    resizedContext.drawImage(canvas, 0, 0, 28, 28);
    image = resizedCanvas.toDataURL('image.png');
    window.location.href = image;

    //turn image to a tensor
    let tfTensor = tf.browser.fromPixels(resizedCanvas, 1);
    tfTensor = tfTensor.squeeze();
    tfTensor = tfTensor.div(255.0);
    tfTensor = tfTensor.expandDims(0);
    tfTensor = tfTensor.cast('float32');
    console.log(tfTensor.shape);

    //run image through model
    let result = model.predict(tfTensor);
    const index = result.as1D().argMax().dataSync()[0];
    result.print();
    setGuess(index);
  };

  const reset = () => {
    console.log('hello');
    const canvas = canvasRef.current;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };
  return (
    <div>
      <div>
        <canvas
          className={styles.draw}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          ref={canvasRef}
        />
      </div>
      <h2 className={styles.description}>
        I believe the number you drew is : {guess}
      </h2>
      <button onClick={evaluate}>Evaluate</button>
      <button onClick={reset}>Clear</button>
    </div>
  );
}
