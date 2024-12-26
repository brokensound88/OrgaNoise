import axios, { AxiosResponse } from 'axios';

interface SecurityQuestion {
  id: string;
  question: string;
  answer: string;
}

interface TwoFactorAuthStatus {
  enabled: boolean;
  secret?: string;
  backupCodes?: string[];
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecurityQuestionData {
  question: string;
  answer: string;
}

class SecurityService {
  private baseUrl = '/api/security';

  async changePassword(userId: string, data: PasswordChangeData): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${userId}/password`, data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async setupTwoFactor(userId: string): Promise<TwoFactorAuthStatus> {
    try {
      const response: AxiosResponse<TwoFactorAuthStatus> = await axios.post(`${this.baseUrl}/${userId}/2fa/setup`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyTwoFactor(userId: string, token: string): Promise<boolean> {
    try {
      const response: AxiosResponse<{ valid: boolean }> = await axios.post(`${this.baseUrl}/${userId}/2fa/verify`, { token });
      return response.data.valid;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async disableTwoFactor(userId: string, token: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${userId}/2fa/disable`, { token });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async setSecurityQuestions(userId: string, questions: SecurityQuestionData[]): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${userId}/security-questions`, { questions });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifySecurityQuestions(userId: string, answers: Record<string, string>): Promise<boolean> {
    try {
      const response: AxiosResponse<{ valid: boolean }> = await axios.post(
        `${this.baseUrl}/${userId}/security-questions/verify`,
        { answers }
      );
      return response.data.valid;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      return new Error(error.response?.data?.message || 'An error occurred with the security service');
    }
    return error instanceof Error ? error : new Error('An unknown error occurred');
  }
}

export const securityService = new SecurityService();
export type { SecurityQuestion, TwoFactorAuthStatus, PasswordChangeData, SecurityQuestionData }; 