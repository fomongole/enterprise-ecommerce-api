import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HealthResolver {
  @Query(() => String)
  healthCheck(): string {
    return 'GraphQL API is healthy and running!';
  }
}
