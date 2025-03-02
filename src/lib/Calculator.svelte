<script lang="ts">
    import { cultureOptions, type DraftRecord } from "./types";
    type Props = {
        onCalculated: (record: DraftRecord) => void;
    };
    let { onCalculated }: Props = $props();

    const TECH_LOSS = 0.6;
    const calculateFactor = (actual: number, base: number) =>
        (100 - actual) / (100 - base);
    const calculateTechLoss = (input: number | undefined) =>
        input ? (input * TECH_LOSS) / 100 : 0;
    let actualWeight: number | undefined = $state();
    let baseMoisture: number | undefined = $state();
    let actualMoisture: number | undefined = $state();
    let baseImpurity: number | undefined = $state();
    let actualImpurity: number | undefined = $state();
    let culture: string | undefined = $state();
    let techLoss: number = $derived(calculateTechLoss(actualWeight));
    // Calculate moisture loss in kg
    let moistureLoss: number = $derived(
        actualWeight && baseMoisture && actualMoisture
            ? parseFloat(
                  (
                      actualWeight *
                      (1 - calculateFactor(actualMoisture, baseMoisture))
                  ).toFixed(2),
              )
            : 0,
    );

    // Calculate impurity loss in kg
    let impurityLoss: number = $derived(
        actualWeight && baseImpurity && actualImpurity
            ? parseFloat(
                  (
                      actualWeight *
                      (1 - calculateFactor(actualImpurity, baseImpurity))
                  ).toFixed(2),
              )
            : 0,
    );

    let result: string = $derived(
        actualWeight &&
            baseMoisture &&
            baseImpurity &&
            actualMoisture &&
            actualImpurity
            ? // actualWeight *
              //     calculateFactor(actualMoisture, baseMoisture) *
              //     calculateFactor(actualImpurity, baseImpurity) -
              // techLoss
              (actualWeight - techLoss - impurityLoss - moistureLoss).toFixed(2)
            : "0",
    );
    const nowDate: string = new Date().toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "numeric",
    });
    $effect(() => {
        if (
            actualWeight &&
            baseMoisture &&
            actualMoisture &&
            baseImpurity &&
            actualImpurity &&
            culture &&
            techLoss &&
            moistureLoss &&
            impurityLoss &&
            result !== "0"
        ) {
            onCalculated({
                actualWeight,
                baseMoisture,
                actualMoisture,
                baseImpurity,
                actualImpurity,
                culture,
                techLoss,
                moistureLoss,
                impurityLoss,
                result,
                date: nowDate,
            });
        }
    });
</script>

<div>
    <h4>Расчёт зачётного веса зерна</h4>
    <form id="grainForm">
        <div class="cols">
            <div>
                <label for="actualWeight">Фактический вес (кг):</label>
                <input
                    type="number"
                    id="actualWeight"
                    name="actualWeight"
                    bind:value={actualWeight}
                    inputmode="numeric"
                    placeholder="-------"
                    min="1000"
                    pattern="\d*"
                    required
                />
                <dl>
                    <dt>Мех потери (кг):</dt>
                    <dd class="strong">{techLoss}</dd>
                </dl>
            </div>
            <div>
                <label for="culture">Культура:</label>
                <select
                    name="culture"
                    aria-label="Выберите культуру"
                    bind:value={culture}
                    required
                >
                    <option selected disabled value="">-------</option>
                    {#each cultureOptions as culture, idx}
                        <option value={culture}>{culture}</option>
                    {/each}
                </select>
            </div>
        </div>
        <br />

        <div class="cols">
            <div>
                <label for="actualMoisture">Фактическая влажность (%):</label>
                <input
                    type="number"
                    id="actualMoisture"
                    name="actualMoisture"
                    bind:value={actualMoisture}
                    inputmode="decimal"
                    placeholder="-------"
                    min="0"
                    max="40"
                    pattern="[0-9]*"
                    required
                />
                <dl>
                    <dt>Усушка (кг):</dt>
                    <dd class="strong">{moistureLoss}</dd>
                </dl>
            </div>

            <div>
                <label for="baseMoisture">Базовая влажность (%):</label>
                <input
                    type="number"
                    id="baseMoisture"
                    name="baseMoisture"
                    bind:value={baseMoisture}
                    placeholder="-------"
                    inputmode="numeric"
                    min="7"
                    max="14"
                    pattern="\d*"
                    required
                />
            </div>
        </div>

        <div class="cols">
            <div>
                <label for="actualImpurity"
                    >Фактическая сорная примесь (%):</label
                >
                <input
                    type="number"
                    id="actualImpurity"
                    name="actualImpurity"
                    bind:value={actualImpurity}
                    inputmode="decimal"
                    placeholder="-------"
                    min="1"
                    max="50"
                    pattern="[0-9]*"
                    required
                />
                <dl>
                    <dt>Отходы (кг):</dt>
                    <dd class="strong">{impurityLoss}</dd>
                </dl>
            </div>

            <div>
                <label for="baseImpurity">Базовая сорная примесь (%):</label>
                <input
                    type="number"
                    id="baseImpurity"
                    name="baseImpurity"
                    bind:value={baseImpurity}
                    inputmode="numeric"
                    placeholder="-------"
                    min="1"
                    max="3"
                    pattern="\d*"
                    required
                />
            </div>
            <label for="date">Дата:</label>
            <h5>
                {nowDate}
            </h5>
        </div>
    </form>
</div>

<div>
    <h4>Результат:</h4>
    <h1 id="result">{result}</h1>
</div>

<style>
    .cols {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }
    #result {
        font-size: 4rem;
        font-family: "Courier New", Courier, monospace;
    }
    input {
        font-size: 1.5rem;
    }
    .strong {
        font-family: "Courier New", Courier, monospace;
        font-size: 1.5rem;
    }
</style>
