import React from 'react';
import { Icon } from '@iconify/react';

const RobotIcon = ({ icon, size = '1em', className = '', animated = false, ...props }) => {
  const iconClassNames = [
    'robot-icon',
    className,
    animated ? 'robot-icon-animated' : '',
  ].filter(Boolean).join(' ');

  return (
    <Icon
      icon={icon}
      fontSize={size}
      className={iconClassNames}
      {...props}
    />
  );
};

// Predefined robotic and tech-themed icons
export const RoboticIcons = {
  // Robot-related icons
  robot: 'mdi:robot',
  robotOutline: 'mdi:robot-outline',
  robotIndustrial: 'mdi:robot-industrial',
  robotVacuum: 'mdi:robot-vacuum',
  android: 'mdi:android',
  humanoid: 'mdi:humanoid',

  // Gear/mechanical icons
  gear: 'mdi:gear',
  gearOutline: 'mdi:gear-outline',
  cogs: 'mdi:cogs',
  settings: 'mdi:settings',
  wrench: 'mdi:wrench',
  hammer: 'mdi:hammer',

  // Neural network/AI icons
  brain: 'mdi:brain',
  neural: 'mdi:neural-network',
  cpu: 'mdi:cpu-64-bit',
  memory: 'mdi:memory',
  algorithm: 'mdi:algorithm',
  ai: 'mdi:artificial-intelligence',

  // Tech/robotics icons
  circuit: 'mdi:circuit',
  sensor: 'mdi:sensor',
  radar: 'mdi:radar',
  radarCircle: 'mdi:radar-circle',
  radarCircleOutline: 'mdi:radar-circle-outline',
  connection: 'mdi:connection',
  network: 'mdi:network',

  // Hardware icons
  microchip: 'mdi:microchip',
  motherboard: 'mdi:motherboard',
  cpuChip: 'mdi:cpu-32-bit',
  processor: 'mdi:processor',
  chip: 'mdi:chip',

  // Science/tech icons
  science: 'mdi:test-tube',
  experiment: 'mdi:flask',
  lab: 'mdi:flask-outline',
  research: 'mdi:microscope',
  telescope: 'mdi:telescope',

  // Navigation/control icons
  controller: 'mdi:controller',
  joystick: 'mdi:joystick',
  remote: 'mdi:remote',
  control: 'mdi:remote-tv',
  automation: 'mdi:robot-happy',
  automationOutline: 'mdi:robot-happy-outline',

  // Data/communication icons
  data: 'mdi:data-matrix',
  database: 'mdi:database',
  cloud: 'mdi:cloud',
  networkStrength: 'mdi:network-strength-4',
  communication: 'mdi:communication',

  // Energy/power icons
  battery: 'mdi:battery',
  power: 'mdi:power',
  lightning: 'mdi:lightning-bolt',
  energy: 'mdi:energy',
  batteryCharging: 'mdi:battery-charging',

  // Movement/kinematics icons
  motion: 'mdi:motion',
  motionSensor: 'mdi:motion-sensor',
  movement: 'mdi:motion-play',
  trajectory: 'mdi:vector-curve',
  path: 'mdi:path',

  // Vision/perception icons
  eye: 'mdi:eye',
  eyeOutline: 'mdi:eye-outline',
  camera: 'mdi:camera',
  cameraOutline: 'mdi:camera-outline',
  vision: 'mdi:eye-circle',
  perception: 'mdi:eye-circle-outline',

  // Learning/intelligence icons
  learning: 'mdi:brain',
  intelligence: 'mdi:artificial-intelligence',
  neuralNetwork: 'mdi:neural-network',
  decisionTree: 'mdi:chart-tree',
  training: 'mdi:training',

  // Simulation icons
  simulation: 'mdi:gamepad-variant',
  simulationOutline: 'mdi:gamepad-variant-outline',
  virtualReality: 'mdi:virtual-reality',
  cube: 'mdi:cube',
  cubeOutline: 'mdi:cube-outline',

  // Communication icons
  message: 'mdi:message-processing',
  messageOutline: 'mdi:message-processing-outline',
  chat: 'mdi:chat',
  chatOutline: 'mdi:chat-outline',
  communication: 'mdi:communication',
  communicationOutline: 'mdi:communication-outline',
};

export default RobotIcon;