function workLoop(fiber, visit) {
  visit(fiber);

  if (fiber.child) {
    return workLoop(fiber.child, visit);
  }

  let node = fiber;
  while (node) {
    if (node.sibling) {
      return workLoop(node.sibling, visit);
    }
    node = node.return;
  }
}

export { workLoop };
