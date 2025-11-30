//role utama sistem
export type UserRole = 'admin' | 'guru' | 'siswa';

export interface LoginData {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
}