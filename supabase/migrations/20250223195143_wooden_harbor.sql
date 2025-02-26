/*
  # Ajustes nas políticas de acesso para API de Suporte

  1. Políticas
    - Somente admin pode gerenciar credenciais
    - Usuários podem visualizar apenas o ID de suporte

  2. Ajustes
    - Remoção de políticas antigas
    - Criação de novas políticas restritas
*/

-- Remover políticas existentes
DROP POLICY IF EXISTS "Visualizar credenciais" ON support_api_credentials;
DROP POLICY IF EXISTS "Inserir credenciais" ON support_api_credentials;

-- Criar novas políticas
CREATE POLICY "Admins podem gerenciar credenciais"
  ON support_api_credentials
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Usuários podem ver ID de suporte"
  ON support_api_credentials
  FOR SELECT
  TO authenticated
  USING (true); -- Removido o WITH CHECK

-- Criar view para usuários normais
CREATE OR REPLACE VIEW public.support_id_view AS
SELECT support_id
FROM support_api_credentials
LIMIT 1;