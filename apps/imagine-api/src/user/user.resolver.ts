import {now, omit} from 'lodash';
import {UserArgs} from './user.args';
import {UserModel} from './user.model';
import {PubSub} from 'graphql-subscriptions';
import {UserEntity} from '../database/user.entity';
import {DEFAULT_USER_VALUES} from './user.constant';
import {UserDataloaderService} from './user.dataloader';
import {UserRepository} from '../database/user.repository';
import {RankRepository} from '../database/rank.repository';
import {HasSession} from '../session/has-session.decorator';
import {UserCreateInput, UserUpdateInput} from './user.input';
import {SessionRepository} from '../database/session.repository';
import {forwardRef, Inject, UnauthorizedException} from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import {RankModel} from '../rank/rank.model';
import {GetUser} from '../session/get-user.decorator';
import {UserOnlineStatus, UserShowOnlineStatus} from '@imagine-cms/types';

const pubSub = new PubSub();

@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private readonly userRepo: UserRepository,
    @Inject(forwardRef(() => RankRepository))
    private readonly rankRepo: RankRepository,
    @Inject(forwardRef(() => SessionRepository))
    private readonly sessionRepo: SessionRepository,
    private readonly userDataloaderService: UserDataloaderService
  ) {}

  @ResolveField('email')
  @HasSession()
  email(
    @Parent() {id, email}: UserEntity,
    @GetUser() user: UserEntity
  ): string {
    this.ownsResourceOrCanManageUsers(id, user);
    return email;
  }

  @ResolveField('gameSSO')
  @HasSession()
  gameSSO(
    @Parent() {id, gameSSO}: UserEntity,
    @GetUser() user: UserEntity
  ): string {
    this.ownsResource(id, user);
    return gameSSO;
  }

  @ResolveField('ipLast')
  @HasSession()
  ipLast(
    @Parent() {id, ipLast}: UserEntity,
    @GetUser() user: UserEntity
  ): string {
    this.ownsResourceOrCanManageUsers(id, user);
    return ipLast;
  }

  @ResolveField('ipRegisteredWith')
  @HasSession()
  ipRegisteredWith(
    @Parent() {id, ipRegisteredWith}: UserEntity,
    @GetUser() user: UserEntity
  ): string {
    this.ownsResourceOrCanManageUsers(id, user);
    return ipRegisteredWith;
  }

  @ResolveField('lastOnline')
  lastOnline(
    @Parent() {id, lastOnline, showOnlineStatus}: UserEntity
  ): number | null {
    if (showOnlineStatus === UserShowOnlineStatus.Hidden) {
      return null;
    }
    return lastOnline;
  }

  @ResolveField('onlineStatus')
  onlineStatus(
    @Parent() {id, onlineStatus, showOnlineStatus}: UserEntity
  ): string {
    if (showOnlineStatus === UserShowOnlineStatus.Hidden) {
      return UserOnlineStatus.Offline;
    }
    return onlineStatus;
  }

  @ResolveField('rank', () => RankModel)
  getRank(@Parent() {rankID}: UserEntity): Promise<RankModel> {
    return this.rankRepo.findOneOrFail({id: rankID});
  }

  @Query(() => UserModel)
  async user(@Args('id') id: number): Promise<UserEntity> {
    return this.userDataloaderService.loadById(id);
  }

  @Query(() => [UserModel])
  users(@Args() userArgs: UserArgs): Promise<UserEntity[]> {
    return this.userRepo.find(omit(userArgs, 'other'), userArgs.other);
  }

  @Mutation(() => UserModel)
  async userCreate(
    @Args('newUser') userCreateInput: UserCreateInput
  ): Promise<UserEntity> {
    const secondsSinceEpoch = parseInt(`${now() / 1000}`);
    const newUser = await this.userRepo.create({
      ...DEFAULT_USER_VALUES,
      ...userCreateInput,
      gameSSO: '',
      accountCreatedAt: secondsSinceEpoch,
      lastOnline: secondsSinceEpoch,
      ipLast: '', // TODO: Add support for IPs,
      ipRegisteredWith: '', // TODO: Add support for IPs
    });
    pubSub.publish('userCreated', {userCreated: newUser});
    return newUser;
  }

  @Subscription(() => UserModel)
  userCreated() {
    return pubSub.asyncIterator('userCreated');
  }

  @Mutation(() => Boolean)
  async userUpdate(
    @Args('id') id: number,
    @Args('userChanges') userChanges: UserUpdateInput
  ) {
    await this.userRepo.update({id}, userChanges);
    await this.userDataloaderService.clearByID(id);
    return true;
  }

  @Mutation(() => Boolean)
  async userDelete(@Args('id') id: number) {
    const deletedUser = await this.userRepo.findOneOrFail({id});
    pubSub.publish('userDeleted', {userDeleted: deletedUser});
    await this.userRepo.delete({id});
    await this.userDataloaderService.clearByID(id);
    return true;
  }

  @Subscription(() => UserModel)
  userDeleted() {
    return pubSub.asyncIterator('userDeleted');
  }

  private ownsResource(userID: number, authenticatedUser: UserEntity) {
    if (Number(userID) !== Number(authenticatedUser.id)) {
      throw new UnauthorizedException();
    }
  }

  private ownsResourceOrCanManageUsers(
    userID: number,
    authenticatedUser: UserEntity
  ) {
    console.log(userID, authenticatedUser);
    if (authenticatedUser.rank?.scopes?.manageUsers) {
      return;
    }

    this.ownsResource(userID, authenticatedUser);
  }
}
