Desafio Pokedex App – Angular + Django

Aplicação desenvolvida como desafio técnico, composta por frontend em Angular e backend em Django REST Framework, que consome dados da PokéAPI e disponibiliza uma interface simples de consulta e autenticação.

-----Credenciais de Acesso: 
Usuário: usuario 
Senha: desafiokogui

-----Tecnologias Utilizadas:
Frontend: Angular
Backend: Django + Django REST Framework
Autenticação: JWT (djangorestframework-simplejwt)
Integrações: PokéAPI

-----Como Rodar o Projeto:
Subir o Backend (Django):

Criar e ativar ambiente virtual 
- cd backend python -m venv venv 
- (Windows) .\venv\Scripts\activate 
- (Linux/Mac) source venv/bin/activate

Instalar dependências:
- pip install django djangorestframework djangorestframework-simplejwt django-cors-headers requests

Rodar o servidor:
- python manage.py migrate
- python manage.py runserver

O backend ficará disponível em: http://127.0.0.1:8000/

Subir o Frontend (Angular): 
- cd frontend 
- npm install 
- npm start

O frontend ficará disponível em: http://localhost:4200/