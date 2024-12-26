import axios from 'axios';

export type VerificationType = 'email' | 'phone' | 'document';
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'expired';

export interface VerificationRequest {
  id: string;
  userId: string;
  type: VerificationType;
  value: string;
  status: VerificationStatus;
  code?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentVerification {
  id: string;
  userId: string;
  documentType: string;
  documentNumber: string;
  status: VerificationStatus;
  fileUrl: string;
  rejectionReason?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

class ProfileVerificationService {
  private baseUrl = '/api/profile-verification';

  // Email Verification
  async sendEmailVerification(userId: string, email: string): Promise<VerificationRequest> {
    try {
      const response = await axios.post<VerificationRequest>(`${this.baseUrl}/email`, {
        userId,
        email,
      });
      return {
        ...response.data,
        expiresAt: new Date(response.data.expiresAt),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to send email verification:', error);
      throw error;
    }
  }

  async verifyEmail(userId: string, code: string): Promise<VerificationRequest> {
    try {
      const response = await axios.post<VerificationRequest>(`${this.baseUrl}/email/verify`, {
        userId,
        code,
      });
      return {
        ...response.data,
        expiresAt: new Date(response.data.expiresAt),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to verify email:', error);
      throw error;
    }
  }

  // Phone Verification
  async sendPhoneVerification(userId: string, phoneNumber: string): Promise<VerificationRequest> {
    try {
      const response = await axios.post<VerificationRequest>(`${this.baseUrl}/phone`, {
        userId,
        phoneNumber,
      });
      return {
        ...response.data,
        expiresAt: new Date(response.data.expiresAt),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to send phone verification:', error);
      throw error;
    }
  }

  async verifyPhone(userId: string, code: string): Promise<VerificationRequest> {
    try {
      const response = await axios.post<VerificationRequest>(`${this.baseUrl}/phone/verify`, {
        userId,
        code,
      });
      return {
        ...response.data,
        expiresAt: new Date(response.data.expiresAt),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to verify phone:', error);
      throw error;
    }
  }

  // Document Verification
  async uploadDocument(
    userId: string,
    documentType: string,
    documentNumber: string,
    file: File
  ): Promise<DocumentVerification> {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('documentType', documentType);
      formData.append('documentNumber', documentNumber);
      formData.append('file', file);

      const response = await axios.post<DocumentVerification>(
        `${this.baseUrl}/document`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        expiresAt: response.data.expiresAt ? new Date(response.data.expiresAt) : undefined,
      };
    } catch (error) {
      console.error('Failed to upload document:', error);
      throw error;
    }
  }

  async getDocumentVerification(userId: string): Promise<DocumentVerification[]> {
    try {
      const response = await axios.get<DocumentVerification[]>(
        `${this.baseUrl}/document/${userId}`
      );
      return response.data.map(doc => ({
        ...doc,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
        expiresAt: doc.expiresAt ? new Date(doc.expiresAt) : undefined,
      }));
    } catch (error) {
      console.error('Failed to get document verification:', error);
      throw error;
    }
  }

  // Verification Status
  async getVerificationStatus(userId: string): Promise<{
    email: VerificationRequest | null;
    phone: VerificationRequest | null;
    documents: DocumentVerification[];
  }> {
    try {
      interface VerificationStatusResponse {
        email: VerificationRequest | null;
        phone: VerificationRequest | null;
        documents: DocumentVerification[];
      }

      const response = await axios.get<VerificationStatusResponse>(
        `${this.baseUrl}/status/${userId}`
      );
      const { email, phone, documents } = response.data;

      return {
        email: email
          ? {
              ...email,
              expiresAt: new Date(email.expiresAt),
              createdAt: new Date(email.createdAt),
              updatedAt: new Date(email.updatedAt),
            }
          : null,
        phone: phone
          ? {
              ...phone,
              expiresAt: new Date(phone.expiresAt),
              createdAt: new Date(phone.createdAt),
              updatedAt: new Date(phone.updatedAt),
            }
          : null,
        documents: documents.map((doc: DocumentVerification) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
          updatedAt: new Date(doc.updatedAt),
          expiresAt: doc.expiresAt ? new Date(doc.expiresAt) : undefined,
        })),
      };
    } catch (error) {
      console.error('Failed to get verification status:', error);
      throw error;
    }
  }
}

export const profileVerificationService = new ProfileVerificationService(); 