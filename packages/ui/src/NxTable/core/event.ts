type EventHandler = (...args: any[]) => void

const eventMap = new Map<string, EventHandler[]>()

export function onEvent(name: string, handler: EventHandler) {
  const handlers = eventMap.get(name) ?? []
  handlers.push(handler)
  eventMap.set(name, handlers)
}

export function offEvent(name: string, handler?: EventHandler) {
  if (!handler) {
    eventMap.delete(name)
    return
  }
  const handlers = eventMap.get(name)
  if (handlers) {
    eventMap.set(name, handlers.filter((fn) => fn !== handler))
  }
}

export function emitEvent(name: string, ...args: any[]) {
  eventMap.get(name)?.forEach((handler) => handler(...args))
}
