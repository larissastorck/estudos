# Desafio Semana 3 — LRU Cache do Zero

**Fase:** 0 — DSA aplicado ao frontend
**Tópico:** Hash maps no frontend + cache LRU (usado em SWR, TanStack Query, React Query, browsers)
**Tempo cronometrado:** 40 minutos
**Modo:** pair programming via Live Share (alternar driver a cada 10 min)
**Linguagem:** JavaScript

---

## Contexto do desafio

Vocês estão em uma reunião de arquitetura. O tech lead comenta:

> "Nosso app tem um problema: fazemos as mesmas 5 chamadas para a API do usuário em telas diferentes. Precisamos de um cache, mas não podemos guardar tudo pra sempre — vamos estourar a memória. Como resolvem?"

A resposta correta é: **LRU cache**. Least Recently Used — mantém só os N itens mais recentes, descartando os mais antigos automaticamente.

Nessa call vocês vão:
1. Implementar um LRU cache do zero em JavaScript
2. Entender como isso conecta hash maps + linked lists
3. Aplicar o cache em um cenário real (busca com resultado cacheado)
4. Comparar com o que o SWR/TanStack Query fazem por baixo

---

## Por que LRU cache está em todo lugar (em 1 minuto)

Você usa LRU cache o dia inteiro sem perceber:

- **Browser:** as últimas páginas visitadas ficam em cache pra voltar rápido
- **SWR/TanStack Query:** cache de requests com limite de tamanho
- **Redis (opção MAXMEMORY):** eviction policy padrão é LRU
- **CPU:** L1/L2/L3 cache usa variações de LRU
- **Sistema operacional:** paginação de memória (LRU decide o que sai da RAM)

A ideia é simples e poderosa: **quando o cache enche, remove o que foi usado há mais tempo**. Se um item é usado com frequência, ele "renova" seu lugar.

```
Cache com limite 3:

set("a", 1)  →  [a]
set("b", 2)  →  [b, a]
set("c", 3)  →  [c, b, a]
get("a")     →  [a, c, b]  (a subiu por ser recém-usado)
set("d", 4)  →  [d, a, c]  (b foi descartado, era o mais antigo)
```

> **Nota sobre a notação:** `set("a", 1)` significa "guardar o valor `1` na chave `"a"`". A visualização mostra só as chaves (`[a, c, b]`) porque o que importa é a ordem — quem vai sair primeiro. Os valores (1, 2, 3, 4) estão guardados junto com cada chave.

---

## Por que precisamos de hash map + linked list

Aqui está o insight bonito: **LRU cache combina duas estruturas** porque precisa fazer duas coisas rápido:

| Operação | Complexidade desejada | Estrutura ideal |
|----------|----------------------|-----------------|
| `get(key)` — buscar valor por chave | O(1) | Hash map |
| Reordenar (mover pro topo) | O(1) | Linked list |
| Remover o "mais antigo" | O(1) | Linked list (tail) |

Sozinho, cada um não resolve:
- **Só hash map:** get é O(1), mas descobrir "quem é o mais antigo" é O(n)
- **Só linked list:** reordenar é O(1), mas buscar por chave é O(n)

**Juntos:** o hash map guarda referência direta para o nó da linked list. Bum, tudo O(1).

**Importante:** não são duas listas separadas. É **uma linked list** onde cada nó guarda 3 coisas juntas: chave, valor, e ponteiros para o vizinho anterior e próximo. O hash map só serve como um "índice" que aponta pro nó certo, evitando percorrer a lista.

```
              Cada nó da linked list carrega:
              ┌──────────────┐
              │ key: "a"     │
              │ value: 1     │
              │ prev: →      │
              │ next: →      │
              └──────────────┘

              Estrutura completa:

                    Hash Map (Map do JavaScript)
                    ┌──────────────────────┐
                    │  "a"  →  ptr ───┐    │
                    │  "b"  →  ptr ─┐ │    │
                    │  "c"  →  ptr ┐│ │    │
                    └──────────────┼┼─┼────┘
                                   ││ │
                                   ││ └─────────────┐
                                   │└──────┐        │
                                   ▼       ▼        ▼
                              ┌────────┐ ┌────────┐ ┌────────┐
    (HEAD, mais recente)  ←──►│key: c  │◄►│key: b  │◄►│key: a  │←── (TAIL, mais antigo)
                              │value: 3│ │value: 2│ │value: 1│
                              └────────┘ └────────┘ └────────┘
```

**Por que a chave também fica no nó, se `get()` só retorna o valor?**

Porque na hora de fazer eviction (remover o mais antigo quando o cache enche), você tem o **nó em mãos** (pegou do `tail.prev`), mas precisa deletar a entrada correspondente no hash map. Para deletar do Map, precisa da chave. Se não guardasse a chave no nó, teria que percorrer o Map inteiro procurando qual chave aponta pra esse nó — O(n), quebrando toda a promessa de O(1).

---

## A fraqueza famosa do LRU: "sujar o cache"

Antes de implementar, vale entender uma limitação importante do LRU, porque isso costuma cair em entrevista.

**"Sujar o cache"** significa ocupar espaço com algo que não vai mais ser útil.

Imagina um app com cache LRU de capacidade 3. Durante 1 hora, o usuário fica olhando o perfil do "Usuário 42":

```
Hora 1: cache = [42, ...]
Hora 1: cache = [42, ...]     ← 42 sempre no topo, protegido
Hora 1: cache = [42, ...]     ← acessou 1000 vezes
```

O `42` foi acessado 1000 vezes. Cada acesso, ele "renova" e sobe pro topo. Ótimo, cache funcionou.

**Agora o usuário fecha aquela tela e nunca mais vai olhar o perfil do 42.** Vai olhar outros usuários.

```
Hora 2: acessa 10  →  cache = [10, 42, ...]
Hora 2: acessa 11  →  cache = [11, 10, 42]  ← 42 desce mas ainda tá lá
Hora 2: acessa 12  →  cache = [12, 11, 10]  ← finalmente 42 saiu
```

O `42` **ficou ocupando espaço no cache** por um tempo, mesmo já não sendo mais útil. O LRU só percebe que o `42` não interessa mais quando outros itens forem acessados o suficiente pra empurrá-lo pra fora.

Isso não é bug — é uma característica do LRU. Ele não sabe distinguir entre:
- "Item muito usado no passado, agora nunca mais será usado" (o `42`)
- "Item muito usado no passado, e vai continuar sendo" (usuário logado)

Para o LRU, ambos parecem iguais no momento em que estão sendo usados.

**Analogia:** sua carteira com espaço para 3 cartões. Você usa muito o cartão de uma loja durante um mês. Quando o mês acaba, você não vai mais àquela loja, mas o cartão continua na carteira, ocupando espaço, até você "empurrá-lo" para fora colocando outros cartões novos.

**Alternativas que resolvem isso:**

- **LFU (Least Frequently Used):** rastreia frequência total de uso. Um item usado 1000 vezes fica protegido. Mas tem o problema oposto: itens muito acessados no passado nunca saem, mesmo se você não os usa mais.
- **ARC (Adaptive Replacement Cache):** usa duas listas internas e aprende qual estratégia funciona melhor (recência vs frequência). Adapta dinamicamente.
- **2Q:** novos itens entram numa fila de "prova" primeiro. Só se forem acessados de novo é que promovem para o cache principal. Isso evita que um item usado uma única vez fique ocupando espaço.

Não precisam aprofundar nessas alternativas — o importante é entender que **toda estratégia de cache tem trade-offs**. LRU é o padrão mais usado porque a fraqueza dele (o "sujar") é aceitável na maioria dos casos, e a implementação é simples. Mas em cenários específicos, outras estratégias são melhores.

---

## Setup inicial (~3 min)

```bash
npm create vite@latest lru-cache -- --template react
cd lru-cache
npm install
npm run dev
```

Substituam:
- `src/App.jsx` pelo arquivo `App-base.jsx` (interface para testar)
- Criem `src/lru-cache.js` (aqui vocês vão implementar)

Também tem um arquivo `lru-cache.test.js` — os testes que a implementação precisa passar.

### Como rodar os testes

Dentro da pasta do projeto Vite (`lru-cache/`):

```bash
cd lru-cache
npm install -D vitest
```

No `package.json`, garanta o script de teste:

```json
"scripts": {
  "test": "vitest"
}
```

O arquivo `lru-cache.test.js` importa a implementação de `./src/lru-cache`. Então a classe `LRUCache` precisa estar exportada em `src/lru-cache.js` com a API do enunciado (`get`, `set`, `has`, `delete`, `size`, `keys`).

Para rodar:

```bash
npm test
```

Isso abre o Vitest em modo watch (re-roda quando você salva). Para uma execução única:

```bash
npx vitest run
```

---

## O desafio em 4 partes

### Parte 1 (5 min) — Desenhar a estrutura no papel

**Antes de codar, desenhem juntas em um papel ou Excalidraw:**

1. Como fica o estado interno quando fazemos `set("a", 1); set("b", 2); set("c", 3)` com capacidade 3?
2. O que acontece exatamente com `get("a")` depois disso?
3. E se agora fazemos `set("d", 4)` — quem sai, e por quê?

**Discutam:** por que a linked list precisa ser *doubly linked* (duplamente encadeada) e não simples?

> Dica: pensem em como remover um nó do meio.

### Parte 2 (20 min) — Implementar o LRU

Abram `src/lru-cache.js` e implementem a classe `LRUCache`:

```javascript
class LRUCache {
  constructor(capacity) { /* ... */ }

  get(key) { /* ... */ }
  set(key, value) { /* ... */ }
  has(key) { /* ... */ }
  delete(key) { /* ... */ }
  get size() { /* ... */ }

  // Para debug e visualização
  keys() { /* ordem: mais recente → mais antigo */ }
}

export { LRUCache };
```

**Estrutura interna sugerida:**

Cada nó vai ser um objeto:
```javascript
{ key, value, prev, next }
```

E a classe guarda:
- `this.capacity` — o limite
- `this.cache` — um `Map` que aponta chave → nó
- `this.head` — o nó mais recente (topo da lista)
- `this.tail` — o nó mais antigo (fim da lista)

**Helpers privados que vão te salvar:**
- `moveToHead(node)` — quando `get()` acessa um nó, ele precisa subir pro topo
- `removeNode(node)` — remove um nó da posição atual (não do Map)
- `addToHead(node)` — coloca um nó no topo (mais recente)
- `removeTail()` — remove o nó mais antigo (usado no eviction)

**Dicas do processo:**

- Comecem por `set()` sem se preocupar com capacidade. Depois adicionem o eviction
- `get()` precisa mover o nó para o head (torna-se o mais recente)
- Se `set()` for chamado numa chave existente, atualiza o valor E move para head
- Cuidem dos edge cases: cache vazio, um único item, remover head, remover tail

**Rodem os testes** (ver seção [Como rodar os testes](#como-rodar-os-testes) acima):

```bash
npm test
```

Os testes estão em `lru-cache.test.js` — usem-os como guia. Comecem pelos mais simples.

### Parte 3 (10 min) — Aplicar em um cenário real

Voltem ao `App.jsx` e conectem o cache a uma busca simulada de API:

- Campo de input que "busca" um usuário por ID
- Antes de fazer o "request" (simulado com `setTimeout`), consulta o cache
- Se está no cache, retorna instantâneo
- Se não está, simula 1s de espera, salva no cache e retorna

**Adicionem visualização:**
- Mostrar a ordem atual do cache (mais recente à esquerda)
- Destacar quando é hit (verde) vs miss (laranja)
- Mostrar quantos requests foram "economizados"

### Parte 4 (5 min) — Discussão

1. Qual seria a complexidade de get e set no seu código?
2. O que o SWR/TanStack Query fazem além do LRU? (dica: stale-while-revalidate, invalidação por tag)
3. Se vocês tivessem que adicionar um "tempo de expiração" (TTL) por item, como fariam?
4. Voltem à discussão do "sujar o cache" — durante a implementação de vocês, dá pra ver claramente como isso aconteceria?

---

## Critérios de "completo"

Marquem como ✅ Resolvido se:
- [ ] Todos os testes passam
- [ ] Get e set são O(1) (não usaram `.find()`, `.filter()`, `.indexOf()`)
- [ ] Cache aplicado no App com hit/miss visualizados
- [ ] Ordem do cache está correta após operações mistas

Marquem como ⚠️ Parcial se:
- Cache funciona mas alguns testes falham (ex: edge cases)
- Implementação está O(n) em algum ponto por usar array em vez de linked list

Marquem como ❌ Não terminou se:
- Não conseguiram fazer a linked list funcionar
- Cache não mantém ordem correta

**Importante:** implementar linked list na primeira vez é confuso. Bugs são normais.

---

## Perguntas para a retrospectiva (5 min finais)

1. Qual foi o momento "aha!" da implementação? (o que fez tudo clicar?)
2. Que edge cases quebraram sua implementação primeiro?
3. Vocês perceberam a beleza de combinar duas estruturas? Isso muda como pensam sobre performance?
4. Onde no código do TanStack Query vocês esperariam encontrar algo parecido? (bônus: dar uma olhada no GitHub deles depois)
5. Que outros problemas do dia a dia se resolvem combinando estruturas?

---

## Conteúdo do post no LinkedIn (pré-rascunho)

```
🧠 O que aprendemos sobre LRU cache essa semana

Essa semana eu e [@amiga] implementamos um LRU cache do zero —
o mesmo padrão que está por baixo do SWR, TanStack Query e do
próprio cache do seu browser.

3 insights:

1. LRU cache combina hash map + linked list duplamente encadeada
   porque uma estrutura sozinha não consegue O(1) em tudo. Hash map
   busca rápido, linked list reordena rápido. Juntos, mágica.

2. "Least Recently Used" é literal: cada vez que você acessa uma
   chave, ela sobe pro topo. O que fica esquecido no fundo é o
   primeiro a sair quando o cache enche.

3. LRU tem uma fraqueza: um item muito usado durante um tempo
   "suja" o cache — continua ocupando espaço mesmo depois de
   parar de ser útil. É por isso que existem variações como LFU
   e ARC.

Maior dificuldade: gerenciar os ponteiros prev/next quando remove
um nó do meio da lista. Errei duas vezes antes de desenhar no papel.

Próxima semana: como o DOM é uma árvore (e vamos serializar uma).

#frontend #javascript #datastructures #devjourney
```

---

## Arquivos nesta pasta

- `README.md` — este arquivo
- `App-base.jsx` — interface para conectar o cache (Parte 3)
- `lru-cache.test.js` — testes que sua implementação precisa passar
- `lru-cache-solution.js` — solução de referência (NÃO ABRIR ANTES DE TENTAR)
- `App-solution.jsx` — App conectado à solução (também não abrir antes)

> Sério, resistam a olhar a solução. O aprendizado está em errar e desenhar no papel.

Boa sessão! 🎯
