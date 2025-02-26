import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types/database';
import toast from 'react-hot-toast';

export function Users() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setUsers(data);
  };

  const updateUserRole = async (userId: string, role: 'admin' | 'user') => {
    try {
      await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);
      toast.success('Permissão atualizada com sucesso');
      loadUsers();
    } catch (error) {
      toast.error('Erro ao atualizar permissão');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Usuários do Sistema</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="card">
            <div className="space-y-4">
              <div className="min-h-[3rem]">
                <p className="font-medium break-all">{user.email}</p>
                <p className="text-sm text-gray-400">
                  Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <select
                value={user.role}
                onChange={(e) => updateUserRole(user.id, e.target.value as 'admin' | 'user')}
                className="input w-full bg-gray-700"
              >
                <option value="user">Usuário</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}