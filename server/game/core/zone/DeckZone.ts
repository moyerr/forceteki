import type seedrandom from 'seedrandom';
import type { Card } from '../card/Card';
import type { TokenOrPlayableCard } from '../card/CardTypes';
import type { MoveZoneDestination } from '../Constants';
import { ZoneName, DeckZoneDestination, WildcardRelativePlayer } from '../Constants';
import type Player from '../Player';
import * as Contract from '../utils/Contract';
import * as Helpers from '../utils/Helpers';
import type { IAddRemoveZone, IZoneCardFilterProperties } from './ZoneAbstract';
import { ZoneAbstract } from './ZoneAbstract';

export class DeckZone extends ZoneAbstract<TokenOrPlayableCard> implements IAddRemoveZone {
    public override readonly hiddenForPlayers: WildcardRelativePlayer.Any;
    public override readonly owner: Player;
    public override readonly name: ZoneName.Deck;

    protected deck: TokenOrPlayableCard[] = [];

    public override get cards(): TokenOrPlayableCard[] {
        return [...this.deck];
    }

    public override get count() {
        return this.deck.length;
    }

    public get topCard(): TokenOrPlayableCard | null {
        return this.deck.length > 0 ? this.deck[0] : null;
    }

    public constructor(owner: Player, cards: TokenOrPlayableCard[]) {
        super(owner);

        this.hiddenForPlayers = WildcardRelativePlayer.Any;
        this.name = ZoneName.Deck;

        this.deck = cards;

        cards.forEach((card) => card.initializeZone(this));
    }

    public override getCards(filter?: IZoneCardFilterProperties): TokenOrPlayableCard[] {
        return this.deck.filter(this.buildFilterFn(filter));
    }

    public getTopCards(numCards: number) {
        Contract.assertNonNegative(numCards);

        const cardsToGet = Math.min(numCards, this.deck.length);
        return this.deck.slice(0, cardsToGet);
    }

    public addCardToTop(card: TokenOrPlayableCard) {
        this.addCard(card, DeckZoneDestination.DeckTop);
    }

    public addCardToBottom(card: TokenOrPlayableCard) {
        this.addCard(card, DeckZoneDestination.DeckTop);
    }

    public addCard(card: TokenOrPlayableCard, zone: DeckZoneDestination) {
        Contract.assertTrue(card.isTokenOrPlayable() && !card.isToken());
        Contract.assertEqual(card.controller, this.owner, `Attempting to add card ${card.internalName} to ${this} but its controller is ${card.controller}`);

        switch (zone) {
            case DeckZoneDestination.DeckTop:
                this.deck.unshift(card);
                return;
            case DeckZoneDestination.DeckBottom:
                this.deck.push(card);
                return;
            default:
                Contract.fail(`Unknown value for DeckZoneDestination enum: ${zone}`);
        }
    }

    public removeTopCard(): TokenOrPlayableCard | null {
        return this.deck.pop() ?? null;
    }

    public removeCard(card: Card) {
        Contract.assertTrue(card.isTokenOrPlayable() && !card.isToken());

        const cardIdx = this.deck.indexOf(card);

        Contract.assertFalse(cardIdx === -1, `Attempting to remove card ${card.internalName} from ${this} but it is not there. Its current zone is ${card.zone}.`);

        this.deck.splice(cardIdx, 1);
    }

    public shuffle(randomGenerator: seedrandom) {
        this.deck = Helpers.shuffle(this.deck, randomGenerator);
    }

    protected override checkZoneMatches(card: Card, zone: MoveZoneDestination | null) {
        Contract.assertTrue(
            ([DeckZoneDestination.DeckBottom, DeckZoneDestination.DeckTop] as MoveZoneDestination[]).includes(zone),
            `Attempting to move ${card.internalName} to ${this} with incorrect zone parameter (must be DeckBottom or DeckTop): ${zone}`
        );
    }
}
