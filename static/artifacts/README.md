# Robot Artifacts Repository

This directory contains all reproducibility artifacts for the Physical AI & Humanoid Robotics book. These artifacts enable readers to reproduce, modify, and extend the robot systems described in the book.

## Directory Structure

```
artifacts/
├── urdf/           # Unified Robot Description Format files
├── configs/        # Configuration files for robot parameters
├── diagrams/       # Architectural and system diagrams
└── docs/           # Artifact documentation (this file)
```

## Artifact Types

### URDF Files
- **Purpose**: Robot kinematic and dynamic descriptions
- **Format**: XML-based Unified Robot Description Format
- **Usage**: Simulation, visualization, and control system development
- **Extension**: `.urdf`

### Configuration Files
- **Purpose**: Runtime parameters and system configuration
- **Format**: YAML (preferred) or JSON
- **Usage**: Robot control, sensor calibration, and system setup
- **Extension**: `.yaml` or `.json`

### Diagrams
- **Purpose**: System architecture and workflow visualization
- **Format**: SVG (preferred), PNG, or Draw.io
- **Usage**: Documentation, planning, and communication
- **Extension**: `.svg`, `.png`, or `.drawio`

## Reproducibility Guidelines

To ensure maximum reproducibility of the robot systems described in this book:

1. **Version Control**: All artifacts are versioned with semantic versioning
2. **Dependencies**: Specify required software versions (ROS 2, Gazebo, etc.)
3. **Validation**: Include validation scripts to test artifact integrity
4. **Documentation**: Each artifact includes usage documentation

## Usage Instructions

### For Simulation
1. Load the URDF file into your simulation environment
2. Apply the configuration parameters from the config files
3. Use diagrams as reference for system architecture

### For Hardware Implementation
1. Use URDF as reference for physical dimensions and joint limits
2. Adapt configuration parameters for your specific hardware
3. Follow architectural patterns shown in diagrams

## License

All artifacts in this repository are licensed under the Creative Commons Attribution 4.0 International License, allowing for reuse, modification, and distribution with proper attribution.