# Data Model for Physical AI & Humanoid Robotics Book

## Core Entities

### Module
- **name**: string (required) - The name of the module (e.g., "The Robotic Nervous System (ROS 2)")
- **description**: string (required) - Brief description of the module content
- **order**: number (required) - Sequential order for progression (1-4)
- **chapters**: Chapter[] (required) - Array of chapters belonging to this module
- **dependencies**: string[] (optional) - Prerequisites from other modules
- **reproducibility_artifacts**: string[] (optional) - List of URDF, config, or other files

### Chapter
- **title**: string (required) - Chapter title
- **module_id**: string (required) - Reference to parent module
- **order**: number (required) - Sequential order within module (1-n)
- **objectives**: string[] (required) - Learning objectives for the chapter
- **content_path**: string (required) - Path to MDX content file
- **artifacts**: string[] (optional) - List of technical artifacts for this chapter
- **validation_hooks**: string[] (required) - How to validate this chapter's content

### ContentReference
- **type**: enum (required) - One of: "book", "paper", "documentation", "code", "video", "other"
- **title**: string (required) - Title of the reference
- **author**: string[] (required) - List of authors
- **year**: number (required) - Publication year
- **source**: string (required) - Where the reference was found (URL, journal, book title)
- **url**: string (optional) - Direct link to the reference
- **is_peer_reviewed**: boolean (required) - Whether this is peer-reviewed content
- **citation**: string (required) - APA 7 formatted citation

### ReproducibilityArtifact
- **name**: string (required) - Name of the artifact (e.g., "robot.urdf", "config.yaml")
- **type**: enum (required) - One of: "urdf", "config", "launch", "script", "model", "other"
- **module_id**: string (required) - Module this artifact belongs to
- **chapter_id**: string (optional) - Specific chapter this artifact relates to
- **description**: string (required) - What the artifact does or represents
- **usage**: string (required) - How to use the artifact
- **requirements**: string[] (optional) - System requirements for the artifact

## Relationships

### Module-Chapter Relationship
- One Module has many Chapters
- Each Chapter belongs to exactly one Module
- Chapters are ordered within their Module

### Chapter-Artifact Relationship
- One Chapter may have many ReproducibilityArtifacts
- One ReproducibilityArtifact belongs to one Chapter (or Module if not chapter-specific)

### ContentReference-Module Relationship
- One Module may have many ContentReferences
- ContentReferences support the content of the Module

## Validation Rules

### Module Validation
- Module name must be unique within the book
- Module order must be sequential (1, 2, 3, 4)
- Module must have at least 3 chapters and no more than 5
- Module dependencies must reference existing modules

### Chapter Validation
- Chapter title must be unique within its Module
- Chapter order must be sequential within its Module
- Chapter content_path must point to an existing MDX file
- Chapter objectives must be specific and measurable

### ContentReference Validation
- Citation must be in APA 7 format
- is_peer_reviewed must be determined based on source verification
- All references must be accessible and valid

### ReproducibilityArtifact Validation
- Artifact name must be unique within its module context
- Artifact type must be one of the defined enum values
- Artifact description must clearly explain its purpose