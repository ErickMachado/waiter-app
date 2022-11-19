export interface UseCase<P, R> {
  execute(payload?: P): Promise<R>;
}
