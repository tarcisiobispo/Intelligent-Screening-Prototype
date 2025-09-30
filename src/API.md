# 📡 Mock API Documentation

## Overview

This document describes the Mock API endpoints used in the Triagem Inteligente system. All endpoints simulate network delays and return realistic data for prototyping purposes.

## Base URL

```
/api
```

## Authentication

Mock authentication is not required for this prototype. In production, all endpoints would require JWT tokens.

---

## Endpoints

### 📤 Upload Documents

Upload one or more documents for OCR processing.

**Endpoint:** `POST /api/documents/upload`

**Request:**
```typescript
interface UploadRequest {
  files: File[];
}
```

**Response:**
```typescript
interface Document {
  id: string;
  title: string;
  type: string;
  ocr_confidence: number;
  score: number;
  summary: string;
  entities: Record<string, string>;
  uploadedAt: string;
  status: 'pending' | 'reviewed' | 'archived';
}

// Returns: Document[]
```

**Timing:** 500-1000ms per file

**Example:**
```javascript
const documents = await mockApi.uploadDocuments([file1, file2]);
```

---

### 📄 Get Documents

Retrieve all documents with optional filtering.

**Endpoint:** `GET /api/documents`

**Query Parameters:**
- `search` (string, optional) - Semantic search query
- `type` (string, optional) - Filter by document type
- `minScore` (number, optional) - Minimum score filter (0-1)
- `maxScore` (number, optional) - Maximum score filter (0-1)
- `status` (string, optional) - Filter by status

**Response:**
```typescript
interface Document {
  id: string;
  title: string;
  type: string;
  ocr_confidence: number;
  score: number;
  summary: string;
  entities: Record<string, string>;
  uploadedAt: string;
  status: 'pending' | 'reviewed' | 'archived';
  content?: string;
  highlights?: Highlight[];
  auditTrail?: AuditEntry[];
}

interface Highlight {
  text: string;
  type: 'risk' | 'equipment' | 'date' | 'value';
  position: { start: number; end: number };
}

interface AuditEntry {
  action: string;
  user: string;
  timestamp: string;
}

// Returns: Document[] (sorted by score DESC)
```

**Timing:** 200-400ms

**Example:**
```javascript
// Get all documents
const docs = await mockApi.getDocuments();

// Get high priority documents
const highPriority = await mockApi.getDocuments({ minScore: 0.7 });

// Search documents
const results = await mockApi.getDocuments({ search: 'transformador' });
```

---

### 📄 Get Single Document

Retrieve detailed information for a specific document.

**Endpoint:** `GET /api/documents/:id`

**Parameters:**
- `id` (string) - Document ID

**Response:**
```typescript
// Returns: Document | null
```

**Timing:** 150-300ms

**Example:**
```javascript
const doc = await mockApi.getDocument('doc_001');
```

---

### 🔄 Reprocess Document

Trigger OCR reprocessing for a document with low confidence.

**Endpoint:** `POST /api/documents/:id/reprocess`

**Parameters:**
- `id` (string) - Document ID

**Response:**
```typescript
// Returns: Document (with updated ocr_confidence and auditTrail)
```

**Timing:** 1500-3000ms (simulates OCR processing)

**Example:**
```javascript
const reprocessed = await mockApi.reprocessDocument('doc_004');
```

---

### ✅ Create Task

Create a new task linked to a document.

**Endpoint:** `POST /api/tasks`

**Request:**
```typescript
interface CreateTaskRequest {
  title: string;
  description: string;
  documentId: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string; // ISO 8601 format
}
```

**Response:**
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  documentId: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string;
  createdAt: string;
}

// Returns: Task
```

**Timing:** 300-600ms

**Example:**
```javascript
const task = await mockApi.createTask({
  title: 'Investigar T123',
  description: 'Temperatura anômala detectada',
  documentId: 'doc_001',
  assignee: 'João Silva',
  priority: 'high',
  dueDate: '2025-10-01',
});
```

---

### ✅ Get Tasks

Retrieve all tasks.

**Endpoint:** `GET /api/tasks`

**Response:**
```typescript
// Returns: Task[] (sorted by createdAt DESC)
```

**Timing:** 200-400ms

**Example:**
```javascript
const tasks = await mockApi.getTasks();
```

---

### 💬 Submit Feedback

Submit user feedback for a document classification.

**Endpoint:** `POST /api/documents/:id/feedback`

**Request:**
```typescript
interface FeedbackRequest {
  rating: number; // 0 (negative) or 1 (positive)
  comment: string;
}
```

**Response:**
```typescript
// Returns: void
```

**Timing:** 200-400ms

**Example:**
```javascript
await mockApi.submitFeedback('doc_001', {
  rating: 1,
  comment: 'Classificação correta',
});
```

---

### 📊 Get Dashboard Stats

Retrieve dashboard statistics and metrics.

**Endpoint:** `GET /api/stats`

**Response:**
```typescript
interface Stats {
  totalDocuments: number;
  pendingReview: number;
  highPriority: number;
  lowConfidence: number;
  tasksOpen: number;
  avgProcessingTime: string;
  documentsToday: number;
  weeklyTrend: string;
}

// Returns: Stats
```

**Timing:** 300-500ms

**Example:**
```javascript
const stats = await mockApi.getStats();
```

---

### 📈 Get Chart Data

Retrieve data for dashboard charts.

**Endpoint:** `GET /api/charts`

**Response:**
```typescript
interface ChartData {
  documentsByDay: Array<{ date: string; count: number }>;
  documentsByType: Array<{ type: string; count: number }>;
  scoreDistribution: Array<{ range: string; count: number }>;
}

// Returns: ChartData
```

**Timing:** 200-300ms

**Example:**
```javascript
const chartData = await mockApi.getChartData();
```

---

## Mock Data

### Sample Documents

#### doc_001 - High Priority (Score: 95%)
```json
{
  "id": "doc_001",
  "title": "Inspeção transformador T123",
  "type": "Relatório",
  "ocr_confidence": 0.82,
  "score": 0.95,
  "summary": "Temperatura 120°C no transformador T123. Recomendado desligamento.",
  "entities": {
    "equipment": "T123",
    "temperature": "120°C",
    "date": "2025-09-20"
  },
  "status": "pending"
}
```

#### doc_002 - Medium Priority (Score: 72%)
```json
{
  "id": "doc_002",
  "title": "Laudo vibração bomba B-45",
  "type": "Laudo",
  "ocr_confidence": 0.88,
  "score": 0.72,
  "summary": "Vibração 2.5 mm/s; possível desalinhamento.",
  "entities": {
    "equipment": "B-45",
    "vibration": "2.5 mm/s"
  },
  "status": "pending"
}
```

#### doc_003 - Low Priority (Score: 15%)
```json
{
  "id": "doc_003",
  "title": "NF-2025-0045",
  "type": "Nota Fiscal",
  "ocr_confidence": 0.95,
  "score": 0.15,
  "summary": "NF valor R$14.500",
  "entities": {
    "value": "14500",
    "supplier": "ABC"
  },
  "status": "reviewed"
}
```

#### doc_004 - Low Confidence (32%)
```json
{
  "id": "doc_004",
  "title": "Foto painel - baixa qualidade",
  "type": "Comunicação",
  "ocr_confidence": 0.32,
  "score": 0.50,
  "summary": "Imagem com pouco contraste; OCR baixa confiança",
  "entities": {},
  "status": "pending"
}
```

---

## Error Handling

All endpoints return standard HTTP status codes:

- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

Error response format:
```typescript
interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
}
```

---

## Rate Limiting

Mock API has no rate limiting. Production API would implement:
- 100 requests per minute per API key
- 10,000 requests per day per organization

---

## Webhooks (Mock)

Production API would support webhooks for real-time updates:

**Events:**
- `document.uploaded`
- `document.processed`
- `document.high_priority`
- `task.created`
- `task.completed`

**Webhook Payload:**
```json
{
  "event": "document.high_priority",
  "timestamp": "2025-09-30T10:45:23Z",
  "data": {
    "documentId": "doc_001",
    "score": 0.95,
    "summary": "..."
  }
}
```

---

## Implementation

The Mock API is implemented in `/lib/mockApi.ts` with simulated delays to provide realistic prototyping experience.

**Key Features:**
- Realistic timing delays
- In-memory data storage
- Automatic score calculation
- OCR confidence simulation
- Audit trail generation

---

## Future Enhancements

For production implementation, consider:

1. **Authentication:** JWT tokens with refresh mechanism
2. **Pagination:** Cursor-based pagination for large datasets
3. **Real-time updates:** WebSocket connections for live data
4. **Batch operations:** Bulk upload, delete, update
5. **Advanced filtering:** Complex query syntax
6. **Caching:** Redis for frequently accessed data
7. **File storage:** S3 or similar for document storage
8. **OCR integration:** Azure Computer Vision, AWS Textract, or Google Cloud Vision
9. **ML pipeline:** Real-time score calculation with explainability
10. **Monitoring:** Full observability with metrics and traces

---

**Last Updated:** September 30, 2025  
**Version:** 1.0.0