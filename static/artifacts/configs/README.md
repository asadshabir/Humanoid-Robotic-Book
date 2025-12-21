# Configuration Artifacts

This directory contains configuration files that define runtime parameters for the humanoid robot systems described in the Physical AI & Humanoid Robotics book.

## File Structure

### `robot_config.yaml`
- **Description**: Main configuration file for the sample humanoid robot
- **Format**: YAML (YAML Ain't Markup Language)
- **Sections**: Robot definition, joint limits, physical properties, control parameters, sensors, visualization, and safety limits

## Configuration Sections

### Robot Definition
- **name**: Unique identifier for the robot
- **model**: Reference to the URDF file
- **version**: Semantic version of the configuration

### Joint Configuration
- **limits**: Position, velocity, effort, and safety limits for each joint
- **safety_controller**: Parameters for joint safety controllers
- **pid_gains**: Proportional-Integral-Derivative controller gains

### Physical Properties
- **gravity**: Gravitational acceleration vector
- **simulation_step**: Physics simulation time step
- **real_time_factor**: Simulation speed multiplier

### Control Parameters
- **pid_gains**: Controller parameters for each joint
- **control_rate**: Frequency of control loop updates

### Sensor Configuration
- **imu**: Inertial measurement unit settings
- **force_torque**: Force and torque sensor settings
- **topic**: ROS topic names for sensor data

### Visualization
- **joint_axes**: Show joint axis indicators
- **collision_meshes**: Show collision geometry
- **transparency**: Transparency level for visualization

### Safety Limits
- **max_velocity**: Maximum joint velocity
- **max_acceleration**: Maximum joint acceleration
- **emergency_stop_timeout**: Timeout for emergency stops

## Usage Instructions

### Loading Configuration
```bash
# With ROS 2 launch files
ros2 launch your_package robot_launch.py

# With parameter server
ros2 param load <node_name> robot_config.yaml

# In Python nodes
import yaml
with open('robot_config.yaml', 'r') as file:
    config = yaml.safe_load(file)
```

### Validating Configuration
```bash
# Check YAML syntax
yamllint robot_config.yaml

# Validate structure (custom script)
python validate_config.py robot_config.yaml
```

## Best Practices

1. **Parameter Validation**: Always validate parameter ranges before applying
2. **Safety Margins**: Include safety margins in joint limits
3. **Modular Configuration**: Split large configurations into logical sections
4. **Version Control**: Maintain configuration versions alongside robot models
5. **Documentation**: Include comments explaining parameter choices
6. **Defaults**: Provide sensible default values for optional parameters

## ROS Integration

These configuration files are designed to work with ROS 2 and support:
- Parameter server integration
- Launch file parameter loading
- Runtime parameter updates
- Configuration validation tools

## Troubleshooting

- **Invalid YAML**: Use online YAML validators to check syntax
- **Parameter not loaded**: Verify parameter names match node expectations
- **Joint limits too restrictive**: Adjust limits based on hardware capabilities
- **Control instability**: Tune PID gains for your specific robot