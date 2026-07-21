# Diagrama ER - Projeto

Abaixo está o diagrama ER do banco de dados do projeto (Mermaid syntax). Você pode visualizar esse diagrama em VSCode com a extensão _Mermaid Preview_ ou gerar um SVG/PNG usando o `mermaid-cli`.

```mermaid
%% Diagrama gerado automaticamente a partir dos modelos em api/src/models
erDiagram
  USERS {
    INTEGER id PK
    STRING name
    STRING email
    STRING password
    STRING phone
    STRING cpfCnpj
    STRING role
    TEXT profileImage
    STRING status
    DATETIME createdAt
  }

  PROPERTIES {
    INTEGER id PK
    INTEGER sellerId FK
    STRING title
    TEXT description
    STRING type
    DECIMAL price
    INTEGER bedrooms
    INTEGER bathrooms
    DECIMAL area
    STRING street
    STRING number
    STRING neighborhood
    STRING city
    STRING state
    STRING zipCode
    STRING status
    BOOLEAN featured
    DATETIME createdAt
  }

  PROPERTY_IMAGES {
    INTEGER id PK
    INTEGER propertyId FK
    STRING url
    STRING caption
    INTEGER order
    BOOLEAN isFeatured
  }

  FAVORITES {
    INTEGER id PK
    INTEGER userId FK
    INTEGER propertyId FK
    DATETIME createdAt
  }

  LEADS {
    INTEGER id PK
    INTEGER propertyId FK
    INTEGER vehicleId
    INTEGER buyerId FK
    INTEGER sellerId FK
    STRING name
    STRING email
    STRING phone
    STRING status
    TEXT notes
    STRING source
    DATETIME createdAt
  }

  VISITS {
    INTEGER id PK
    INTEGER propertyId FK
    INTEGER vehicleId
    INTEGER leadId FK
    INTEGER buyerId FK
    INTEGER sellerId FK
    DATETIME scheduledDate
    STRING status
    TEXT notes
    INTEGER feedbackScore
    DATETIME createdAt
  }

  NOTIFICATIONS {
    INTEGER id PK
    INTEGER userId FK
    STRING type
    STRING title
    TEXT message
    JSON metadata
    BOOLEAN read
    DATETIME createdAt
  }

  ADMIN_AUDITS {
    INTEGER id PK
    INTEGER userId FK
    STRING action
    STRING entity
    INTEGER entityId
    TEXT description
    DATETIME createdAt
  }

  SELLER_PROFILES {
    INTEGER id PK
    INTEGER userId FK (unique)
    TEXT bio
    DECIMAL rating
    INTEGER totalSales
    DECIMAL commissionRate
    DATETIME activeSince
  }

  USER_SETTINGS {
    INTEGER id PK
    INTEGER userId FK (unique)
    JSON preferences
    STRING language
    BOOLEAN notificationsEnabled
  }

  REQUEST_ACCOUNTS {
    INTEGER id PK
    STRING name
    STRING email
    STRING cpfCnpj
    STRING password
    STRING status
    DATETIME createdAt
  }

  %% Relations
  USERS ||--o{ PROPERTIES : "1:N (sellerId)"
  PROPERTIES ||--o{ PROPERTY_IMAGES : "1:N (images)"
  USERS ||--o{ FAVORITES : "1:N (userId)"
  PROPERTIES ||--o{ FAVORITES : "1:N (propertyId)"
  USERS ||--o{ LEADS : "1:N (sellerId / buyerId)"
  PROPERTIES ||--o{ LEADS : "1:N (propertyId)"
  LEADS ||--o{ VISITS : "1:N (leadId)"
  USERS ||--o{ VISITS : "1:N (buyerId / sellerId)"
  PROPERTIES ||--o{ VISITS : "1:N (propertyId)"
  USERS ||--o{ NOTIFICATIONS : "1:N (userId)"
  USERS ||--o{ ADMIN_AUDITS : "1:N (userId)"
  USERS ||--|| SELLER_PROFILES : "1:1 (userId)"
  USERS ||--|| USER_SETTINGS : "1:1 (userId)"
```
