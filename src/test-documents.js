import { mockApi } from '../lib/mockApi';

export async function testDocumentsAPI() {
  console.log('Testing documents API...');

  try {
    const documents = await mockApi.getDocuments();
    console.log('✅ Documents loaded successfully:', documents.length);
    console.log('📄 Document titles:', documents.map(d => d.title));

    const firstDoc = documents[0];
    if (firstDoc) {
      console.log('🔍 First document details:', {
        id: firstDoc.id,
        title: firstDoc.title,
        type: firstDoc.type,
        score: firstDoc.score,
        status: firstDoc.status
      });
    }

    return documents;
  } catch (error) {
    console.error('❌ Error loading documents:', error);
    return [];
  }
}

// Auto-run test
testDocumentsAPI();
