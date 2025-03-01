<script lang="ts">
  import Calculator from "./lib/Calculator.svelte";
  import Clients from "./lib/Clients.svelte";
  import { nanoid } from "nanoid";
  import { clientsStore } from "./lib/store";
  import { PageEnum, type DraftRecord, type Record } from "./lib/types";

  let page: PageEnum = $state(PageEnum.CALCULATE);
  let selectedClientId: string = $state("");
  let record: Record | undefined = $state();
  let clientName = $derived(
    selectedClientId
      ? $clientsStore.find((client) => client.id == selectedClientId)?.name
      : ""
  );

  const handleCalculated = (data: DraftRecord) => {
    record = { ...data, clientId: selectedClientId, id: nanoid(12) };
  };

  const handleSaveResult = (event: Event) => {
    event.preventDefault();
    const result = confirm(
      `Вы уверены что хотите добавить запись для ${clientName} c расчётом ${record?.culture || ""} ${record?.result || ""} кг.`
    );
    if (result) {
      clientsStore.update((clients) => {
        return clients.map((client) => {
          if (client.id == selectedClientId && record) {
            const records =
              client?.records && client.records.length
                ? [...client?.records, record]
                : [record];
            return { ...client, records };
          } else {
            return client;
          }
        });
      });
    }
  };
</script>

<nav>
  <ul>
    <li><bold>ЗерноМама</bold></li>
  </ul>
  <ul>
    <li>
      <button
        class:outline={page != PageEnum.CALCULATE}
        onclick={() => (page = PageEnum.CALCULATE)}>Расчёт</button
      >
    </li>
    <li>
      <button
        class:outline={page != PageEnum.CLIENTS}
        onclick={() => (page = PageEnum.CLIENTS)}>Клиенты</button
      >
    </li>
  </ul>
</nav>
<section class="container">
  {#if page == PageEnum.CALCULATE}
    <Calculator onCalculated={(data) => handleCalculated(data)} />
    <form onsubmit={handleSaveResult}>
      <select
        name="clients"
        aria-label="Выберите клиента"
        required
        bind:value={selectedClientId}
      >
        <option selected disabled value=""> Выберите клиента </option>
        {#each $clientsStore as client, idx (client.id)}
          <option value={client.id}>{client.name}</option>
        {/each}
      </select>
      <button
        type="submit"
        disabled={selectedClientId == "" ||
          record == undefined ||
          record.result == "0"}>Добавить Расчёт</button
      >
    </form>
  {:else if page == PageEnum.CLIENTS}
    <Clients />
  {/if}
</section>

<style>
  nav {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: none;
    padding-bottom: none;
  }
</style>
