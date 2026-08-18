// TODO: implementar um percurso "work loop" simplificado que visita
// child primeiro, depois sibling, depois sobe pelo return — isso é
// literalmente o algoritmo de reconciliation do React em miniatura.
//
// Dica de estrutura (pseudocódigo):
// function workLoop(fiber) {
//   visit(fiber);
//   if (fiber.child) return workLoop(fiber.child);
//   let node = fiber;
//   while (node) {
//     if (node.sibling) return workLoop(node.sibling);
//     node = node.return;
//   }
// }

function workLoop(fiber, visit) {}

export { workLoop };
