import axios from 'axios';

export interface PasswordResetRequest {
  id: string;
  userId: string;
  email: string;
  token: string;
  status: 'pending' | 'completed' | 'expired';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountRecoveryRequest {
  id: string;
  userId: string;
  type: 'email' | 'phone' | 'security_questions';
  status: 'pending' | 'verified' | 'expired';
  verificationDetails: {
    email?: string;
    phone?: string;
    questionsAnswered?: number;
  };
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BackupCode {
  id: string;
  userId: string;
  code: string;
  isUsed: boolean;
  usedAt?: Date;
  createdAt: Date;
}

class ProfileRecoveryService {
  private baseUrl = '/api/profile-recovery';

  // Password Reset
  async requestPasswordReset(email: string): Promise<PasswordResetRequest> {
    try {
      const response = await axios.post<PasswordResetRequest>(`${this.baseUrl}/password-reset/request`, {
        email,
      });
      return {
        ...response.data,
        expiresAt: new Date(response.data.expiresAt),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to request password reset:', error);
      throw error;
    }
  }

  async verifyPasswordResetToken(token: string): Promise<boolean> {
    try {
      const response = await axios.post<{ valid: boolean }>(
        `${this.baseUrl}/password-reset/verify`,
        { token }
      );
      return response.data.valid;
    } catch (error) {
      console.error('Failed to verify password reset token:', error);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/password-reset/reset`, {
        token,
        newPassword,
      });
    } catch (error) {
      console.error('Failed to reset password:', error);
      throw error;
    }
  }

  // Account Recovery
  async initiateAccountRecovery(
    identifier: string,
    type: 'email' | 'phone' | 'security_questions'
  ): Promise<AccountRecoveryRequest> {
    try {
      const response = await axios.post<AccountRecoveryRequest>(
        `${this.baseUrl}/account-recovery/initiate`,
        { identifier, type }
      );
      return {
        ...response.data,
        expiresAt: new Date(response.data.expiresAt),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to initiate account recovery:', error);
      throw error;
    }
  }

  async verifyRecoveryCode(
    recoveryId: string,
    code: string
  ): Promise<AccountRecoveryRequest> {
    try {
      const response = await axios.post<AccountRecoveryRequest>(
        `${this.baseUrl}/account-recovery/verify`,
        { recoveryId, code }
      );
      return {
        ...response.data,
        expiresAt: new Date(response.data.expiresAt),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to verify recovery code:', error);
      throw error;
    }
  }

  async verifySecurityQuestions(
    recoveryId: string,
    answers: Record<string, string>
  ): Promise<AccountRecoveryRequest> {
    try {
      const response = await axios.post<AccountRecoveryRequest>(
        `${this.baseUrl}/account-recovery/verify-questions`,
        { recoveryId, answers }
      );
      return {
        ...response.data,
        expiresAt: new Date(response.data.expiresAt),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to verify security questions:', error);
      throw error;
    }
  }

  async completeAccountRecovery(
    recoveryId: string,
    newPassword: string
  ): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/account-recovery/complete`, {
        recoveryId,
        newPassword,
      });
    } catch (error) {
      console.error('Failed to complete account recovery:', error);
      throw error;
    }
  }

  // Backup Codes
  async generateBackupCodes(userId: string): Promise<BackupCode[]> {
    try {
      const response = await axios.post<BackupCode[]>(
        `${this.baseUrl}/${userId}/backup-codes/generate`
      );
      return response.data.map(code => ({
        ...code,
        createdAt: new Date(code.createdAt),
        usedAt: code.usedAt ? new Date(code.usedAt) : undefined,
      }));
    } catch (error) {
      console.error('Failed to generate backup codes:', error);
      throw error;
    }
  }

  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    try {
      const response = await axios.post<{ valid: boolean }>(
        `${this.baseUrl}/${userId}/backup-codes/verify`,
        { code }
      );
      return response.data.valid;
    } catch (error) {
      console.error('Failed to verify backup code:', error);
      throw error;
    }
  }

  async getBackupCodes(userId: string): Promise<BackupCode[]> {
    try {
      const response = await axios.get<BackupCode[]>(
        `${this.baseUrl}/${userId}/backup-codes`
      );
      return response.data.map(code => ({
        ...code,
        createdAt: new Date(code.createdAt),
        usedAt: code.usedAt ? new Date(code.usedAt) : undefined,
      }));
    } catch (error) {
      console.error('Failed to get backup codes:', error);
      throw error;
    }
  }

  async invalidateBackupCodes(userId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${userId}/backup-codes/invalidate`);
    } catch (error) {
      console.error('Failed to invalidate backup codes:', error);
      throw error;
    }
  }
}

export const profileRecoveryService = new ProfileRecoveryService(); 