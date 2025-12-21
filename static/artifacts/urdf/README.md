# URDF (Unified Robot Description Format) Artifacts

This directory contains URDF files that describe the kinematic and dynamic properties of humanoid robots discussed in the Physical AI & Humanoid Robotics book.

## File Structure

### `sample_robot.urdf`
- **Description**: Basic humanoid robot model with head, arms, and legs
- **Joints**: 8 revolute joints, 3 fixed joints
- **Links**: 10 links including base, head, arms, and legs
- **Purpose**: Demonstrates basic humanoid robot structure

## URDF Components

### Links
- **base_link**: Main body of the robot
- **head**: Robot head with visual and collision properties
- **upper_arm/lower_arm**: Arm segments with collision and visual geometry
- **upper_leg/lower_leg**: Leg segments with collision and visual geometry

### Joints
- **Fixed Joints**: Connect static components (head to base)
- **Revolute Joints**: Allow rotational movement (shoulders, elbows, hips, knees)
- **Joint Limits**: Constrain movement to safe ranges

### Visual Properties
- **Geometry**: Box, sphere, and cylinder shapes
- **Materials**: Color definitions for visualization
- **Collision Models**: Simplified geometry for physics simulation

## Usage Instructions

### Loading in Simulation
```bash
# Load in Gazebo
roslaunch gazebo_ros empty_world.launch
rosrun gazebo_ros spawn_model -file $(rospack find your_package)/urdf/sample_robot.urdf -urdf -model sample_robot

# Load in RViz
roslaunch urdf_tutorial display.launch model:=$(rospack find your_package)/urdf/sample_robot.urdf
```

### Validating URDF Files
```bash
# Check for XML syntax errors
xmllint --noout sample_robot.urdf

# Validate with check_urdf tool
check_urdf sample_robot.urdf
```

## Best Practices

1. **Inertial Properties**: Always define realistic inertial properties for stable simulation
2. **Joint Limits**: Set appropriate limits to prevent damage to real hardware
3. **Collision Geometry**: Use simplified collision geometry for better performance
4. **Naming Convention**: Use consistent naming for joints and links
5. **Documentation**: Include comments in URDF files explaining complex sections

## ROS Integration

These URDF files are designed to work with ROS 2 and support:
- Robot State Publisher
- Joint State Publisher
- TF transforms
- Gazebo simulation
- MoveIt! motion planning

## Troubleshooting

- **Robot falls through ground**: Check collision geometry and inertial properties
- **Joints not moving**: Verify joint type and controller configuration
- **Visualization issues**: Ensure material definitions are correct