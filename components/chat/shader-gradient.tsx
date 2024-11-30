import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';

export default function Shader() {
  return (
    <div className="w-full h-full relative">
      <p className="text-right fixed bottom-0 right-0 z-10 font-bold text-white text-8xl m-4">
        Don’t read swagger
        <br />
        Just chat
      </p>
      <ShaderGradientCanvas>
        <ShaderGradient
          color1="#26ff2d"
          color2="#029100"
          color3="#06a700"
          animate="on"
          uSpeed={0.2}
          uDensity={2.5}
          uStrength={3}
          uFrequency={3.5}
          uAmplitude={2}
          cAzimuthAngle={180}
          cPolarAngle={90}
          cDistance={1.5}
          cameraZoom={1}
          lightType="3d"
          brightness={1.2}
          zoomOut={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
