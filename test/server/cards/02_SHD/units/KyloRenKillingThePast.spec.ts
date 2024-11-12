describe('Kylo Ren, Killing the Past', function() {
    integration(function(contextRef) {
        describe('Kylo Ren\'s Ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['kylo-ren#killing-the-past'],
                        groundArena: ['rey#keeping-the-past', 'pyke-sentinel'],
                        base: 'kestro-city',
                        leader: 'leia-organa#alliance-general'
                    }
                });
            });

            it('ignores Villainy aspect penalty when unit Rey is controlled', function () {
                const { context } = contextRef;

                context.player1.clickCard(context.kyloRen);

                // Kylo should cost 6 since it ignores the villainy aspect
                expect(context.player1.countExhaustedResources()).toBe(6);
            });
        });

        describe('Kylo Ren\'s Ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['kylo-ren#killing-the-past'],
                        base: 'kestro-city',
                        leader: 'rey#more-than-a-scavenger'
                    }
                });
            });

            it('ignores Villainy aspect penalty when Rey is the leader', function () {
                const { context } = contextRef;

                context.player1.clickCard(context.kyloRen);

                // Kylo should cost 6 since it ignores the villainy aspect
                expect(context.player1.countExhaustedResources()).toBe(6);
            });
        });

        describe('Kylo Ren\'s Ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: ['kylo-ren#killing-the-past', 'pyke-sentinel', 'battlefield-marine'],
                        base: 'kestro-city',
                        leader: 'rey#more-than-a-scavenger'
                    },
                    player2: {
                        spaceArena: ['concord-dawn-interceptors']
                    }
                });
            });

            it('gives +2/0 and an Experience to a non-Villainy unit', function () {
                const { context } = contextRef;

                context.player1.clickCard(context.kyloRen);
                expect(context.player1).toBeAbleToSelectExactly([context.kyloRen, context.battlefieldMarine, context.pykeSentinel, context.concordDawnInterceptors]);
                context.player1.clickCard(context.concordDawnInterceptors);
                expect(context.concordDawnInterceptors.getPower()).toBe(4);
                expect(context.concordDawnInterceptors.getHp()).toBe(5);

                // Ensure buff is gone but experience remains
                context.moveToNextActionPhase();
                expect(context.concordDawnInterceptors.getPower()).toBe(2);
                expect(context.concordDawnInterceptors.getHp()).toBe(5);
            });

            it('gives +2/0 and no Experience to a villainy unit', function () {
                const { context } = contextRef;

                context.player1.clickCard(context.kyloRen);
                expect(context.player1).toBeAbleToSelectExactly([context.kyloRen, context.battlefieldMarine, context.pykeSentinel, context.concordDawnInterceptors]);
                context.player1.clickCard(context.pykeSentinel);
                expect(context.pykeSentinel.getPower()).toBe(4);
                expect(context.pykeSentinel.getHp()).toBe(3);

                // Ensure buff is gone
                context.moveToNextActionPhase();
                expect(context.pykeSentinel.getPower()).toBe(2);
                expect(context.pykeSentinel.getHp()).toBe(3);
            });
        });
    });
});