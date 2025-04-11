"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Model } from './Model';
import { Effects, OrbitControls } from '@react-three/drei';
import { UnrealBloomPass } from "three-stdlib";
import { API_URL } from '@/api';
extend({ UnrealBloomPass });

function Cube(props) {
  const meshRef = useRef();
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
    }
  });
  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

function Avatar({text}) {
  const [fileCode, setFileCode] = useState(null);
  const [mouthTalk, setMouthTalk] = useState(null);
  const [playAudio, setPlayAudio] = useState(false);
  async function handleSubmit() {
    try {
      const res = await fetch(`${API_URL}/ai/talk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ text })
      });
      const resJson = await res.json();
      console.log(resJson);
      if (resJson.status === true) {
        const aiAns = resJson.aiRes;
        const mouthTalk = resJson?.lipSyncJson;
        const fileCode = resJson?.fileCode;
        setMouthTalk(mouthTalk);
        setFileCode(fileCode);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const buttonRef = useRef();
  useEffect(() => {
    if(text){
      handleSubmit();
    }
  },[text])
  useEffect(() => {
    if (fileCode) {
      setPlayAudio(true);
    }
  },[fileCode]);
  return (
    <>
      
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 50, far: 500000, near: 0.1 }} style={{ width: '100%', height: '100%' ,}}
        gl={{alpha: true}}
        >
    
        <ambientLight />
        {/* <OrbitControls /> */}
        {/* <Effects disableGamma>
          <unrealBloomPass threshold={0.5} strength={1.0} radius={5} />
        </Effects> */}
        <pointLight intensity={50} position={[1, -2, 4]} />
        <group position={[0, -1.2, 1]} rotation={[Math.PI / 10, 0, 0]}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <Model fileCode={fileCode} mouthTalk={mouthTalk} playAudio={playAudio} />
          </group>
        </group>
      </Canvas>
    </>
  );
}

export default Avatar;
