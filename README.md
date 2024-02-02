# prisma_project
# 환경변수
- .env 파일에 어떤 환경변수가 추가되어야 하는지 작성합니다.
DATABASE_URL
DATABASE_HOST
DATABASE_PORT
DATABASE_NAME
DATABASE_USERNAME
DATABASE_PASSWORD
SESSION_SECRET_KEY

# API 명세서 URL && ERD URL
- https://www.notion.so/Node-API-ERD-2987e13f920e411ca97979eaa05aa4ef?pvs=4 

# 더 고민해 보기
1. **암호화 방식**
    - Q : 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 단방향 암호화와 양방향 암호화 중 어떤 암호화 방식에 해당할까요?
    - Hash는 평문을 암호문으로 바꾸는 암호화는 가능 하지만, 암호문을 평문으로 바꾸는 복호화는 불가능하며 암호화만 가능한 단방향 암호화 방식이다.
    - Q : 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?
    - 보안성: 실제 비밀번호가 아닌 hashed_password를 저장함으로, 유출되어도 개인정보를 보호할 수 있다.

2. **인증 방식**
    - Q : JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?
    - 토큰 그 자체가 인증에 필요한 모든 정보를 가지고 있고, 토큰의 사용자가 발급받은 사용자인지 인식하는 기능이 없기 때문에 인증 정보가 유출된다.
    - Q : 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?
    - Access Token 발급을 위한 Refresh Token의 도입. Access Token의 만료시간이 짧기 때문에 노출되었을 경우의 피해를 최소화할 수 있다. 

3. **인증과 인가**
    - Q : 인증과 인가가 무엇인지 각각 설명해 주세요.
    - 인증은 사용자의 신분을 검증하는 작업이고, 인가는 사용자가 권한이 있는지를 검증하는 작업이다.
    - Q : 과제에서 구현한 Middleware는 인증에 해당하나요? 인가에 해당하나요? 그 이유도 알려주세요.
    - 인증 미들웨어이다. email과 password로 해당 사용자의 신분을 인증하고, 이를 통해 개별 router에서 인가를 내주는 방식이기 때문.

4. **Http Status Code**
    - Q : 과제를 진행하면서 사용한 Http Status Code를 모두 나열하고, 각각이 의미하는 것과 어떤 상황에 사용했는지 작성해 주세요.

5. **리팩토링**
    - Q : MySQL, Prisma로 개발했는데 MySQL을 MongoDB로 혹은 Prisma 를 TypeORM 로 변경하게 된다면 많은 코드 변경이 필요할까요? 주로 어떤 코드에서 변경이 필요한가요?
    - 큰 변경이 필요 없다. prisma.schema의 해당 부분의 'mysql' 부분을 고치면 될것이다.
    - datasource db {  provider = "mysql"  url = env("DATABASE_URL")}
		- Q : 만약 이렇게 DB를 변경하는 경우가 또 발생했을 때, 코드 변경을 보다 쉽게 하려면 어떻게 코드를 작성하면 좋을 지 생각나는 방식이 있나요? 있다면 작성해 주세요.
    - "mysql" 형식의 schema와 다른 형식의 schema를 따로 만들고, env에서 db형식을 받아 동일 형식의 schema를 사용하기로 하면 되지 않을까 생각된다.

6. **API 명세서**
    - Q : notion 혹은 엑셀에 작성하여 전달하는 것 보다 swagger 를 통해 전달하면 장점은 무엇일까요?
    - A : RESTful API 문서를 자동으로 구성하는 특수 도구이다.
    - 애플리케이션의 모든 엔드포인트를 살펴볼 수 있으며 요청을 보내고 응답을 수신하여 작동중인 엔드포인트를 테스트해볼 수 있다. 


