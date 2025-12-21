# Diagram Conventions and Standards

This document defines the conventions and standards for creating and using diagrams in the Physical AI & Humanoid Robotics book.

## Diagram Types

### System Architecture Diagrams
- **Purpose**: Show relationships between system components
- **Elements**: Boxes for components, arrows for data flow
- **Colors**: Blue for control systems, green for AI systems, red for sensors
- **Style**: Clean, minimal design with clear labels

### Workflow Diagrams
- **Purpose**: Illustrate process flow and decision points
- **Elements**: Ovals for start/end, rectangles for processes, diamonds for decisions
- **Style**: Sequential flow from top to bottom or left to right

### Data Flow Diagrams
- **Purpose**: Show how data moves through the system
- **Elements**: Circles for processes, rectangles for data stores, arrows for data flow
- **Style**: Clear directionality with labeled arrows

### Network Topology Diagrams
- **Purpose**: Show communication between system components
- **Elements**: Boxes for nodes, lines for connections
- **Style**: Emphasize communication patterns and protocols

## Color Coding Standards

| Color | Component Type | Usage |
|-------|----------------|-------|
| Blue (#007bff) | Control Systems | ROS 2 nodes, controllers, state machines |
| Green (#28a745) | AI/ML Systems | Perception, planning, learning algorithms |
| Red (#dc3545) | Sensors | Cameras, IMU, force/torque sensors |
| Orange (#fd7e14) | Actuators | Motors, servos, pneumatic systems |
| Purple (#6f42c1) | Communication | Network protocols, message passing |
| Gray (#6c757d) | Infrastructure | Power, structural, safety systems |

## Line Style Conventions

| Style | Meaning | Usage |
|-------|---------|-------|
| Solid | Primary data flow | Main communication paths |
| Dashed | Secondary flow | Backup or optional paths |
| Dotted | Control signals | Command or configuration |
| Thick (3px) | High-bandwidth | Image data, point clouds |
| Thin (1px) | Low-bandwidth | Status, parameters |

## File Format Guidelines

### SVG (Scalable Vector Graphics) - Preferred
- **Advantages**: Scalable, editable, small file size
- **Tools**: Inkscape, Adobe Illustrator, Draw.io
- **Usage**: All architectural diagrams
- **Export**: Maintain text as text (not converted to paths)

### PNG (Portable Network Graphics) - Secondary
- **Advantages**: High quality, web-friendly
- **Usage**: Complex diagrams that are difficult to vectorize
- **Resolution**: Minimum 300 DPI for print quality

### Draw.io (XML-based) - Editable
- **Advantages**: Editable source files
- **Usage**: Keep as source, export to SVG for distribution
- **Version Control**: Include both .drawio and exported formats

## Naming Conventions

```
[type]_[scope]_[version].[format]
```

Examples:
- `arch_control_system_v1.svg` - Control system architecture, version 1
- `flow_perception_pipeline_v2.svg` - Perception pipeline flow, version 2
- `topology_network_v1.png` - Network topology, version 1

## Accessibility Requirements

### Text Elements
- **Minimum size**: 12px for body text, 14px for labels
- **Contrast ratio**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Font**: Sans-serif fonts for better readability

### Color Accessibility
- **Colorblind safe**: Use patterns or textures in addition to color
- **High contrast versions**: Provide alternative versions if needed

### Alternative Text
- **SVG titles**: Include `<title>` and `<desc>` elements
- **File descriptions**: Include detailed descriptions in README files

## Version Control

### Git LFS for Large Files
- Diagrams over 1MB should use Git LFS
- SVG files typically don't need LFS due to compression

### Branching Strategy
- `main`: Stable, published diagrams
- `development`: Working versions of diagrams
- `feature/*`: New diagram development

### Change Documentation
- Update version numbers when making changes
- Include change log in diagram description
- Maintain backward compatibility when possible

## Quality Assurance

### Review Checklist
- [ ] Diagram accurately represents the system
- [ ] All elements are properly labeled
- [ ] Colors follow established conventions
- [ ] Text is readable and accessible
- [ ] File format is appropriate
- [ ] Alternative text is provided for complex diagrams

### Validation Tools
- SVG validators to check syntax
- Color contrast checkers
- Accessibility testing tools

## Integration with Book Content

### Referencing Diagrams
- Use consistent naming in book content
- Include diagram version in citations
- Provide direct links to source files when appropriate

### Update Process
- Update diagrams when system architecture changes
- Maintain version synchronization with code
- Document breaking changes in diagrams