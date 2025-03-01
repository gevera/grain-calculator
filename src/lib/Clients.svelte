<script lang="ts">
  import { clientsStore, type ClientWithRecords } from "./store";
  import { nanoid } from "nanoid";
  import type { Culture } from "./types";

  let name = $state("");
  let telephone = $state("");
  let cultureFilter: Culture | undefined = $state();

  const handleSaveClient = (event: Event) => {
    event.preventDefault();
    clientsStore.update((clients) => {
      clients.push({
        id: nanoid(10),
        name,
        telephone,
        records: [],
      });
      return clients;
    });
  };
</script>

<div>
  <h4>Клиенты</h4>

  <div>
    {#each $clientsStore as client, idx (client.id)}
      <div>
        <!-- {JSON.stringify(client)} -->
        <details>
          <summary>{client.name}</summary>
          <div>
            <a href="tel:{client.telephone}">{client.telephone}</a>
            <br />
            {#if client?.records && client.records.length > 0}
              <div class="table">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Дата</th>
                      <th scope="col">Культура</th>
                      <th scope="col">Фактический вес (кг)</th>
                      <th scope="col">Фактическая влажность (%)</th>
                      <th scope="col">Базовая влажность (%)</th>
                      <th scope="col">Фактическая сорная примесь (%)</th>
                      <th scope="col">Базовая сорная примесь (%)</th>
                      <th scope="col">Расчёт зачётного веса</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each cultureFilter ? client.records.filter((c) => c.culture == cultureFilter) : client.records as record, idx (record.id)}
                      <tr>
                        <th>{record.date}</th>
                        <th
                          class="clickable"
                          onclick={() =>
                            cultureFilter
                              ? (cultureFilter = undefined)
                              : (cultureFilter = record.culture)}
                          >{record.culture}</th
                        >
                        <th>{record.actualWeight}</th>
                        <th>{record.actualMoisture}</th>
                        <td>{record.baseMoisture}</td>
                        <td>{record.actualImpurity}</td>
                        <td>{record.baseImpurity}</td>
                        <td>{record.result}</td>
                      </tr>
                    {/each}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>Всего</th>
                      <td> - </td>
                      <td
                        >{cultureFilter
                          ? client.records
                              .filter((c) => c.culture == cultureFilter)
                              .reduce((acc, r) => r.actualWeight + acc, 0)
                          : client.records.reduce(
                              (acc, r) => r.actualWeight + acc,
                              0
                            )}</td
                      >
                      <td> - </td>
                      <td> - </td>
                      <td> - </td>
                      <td> - </td>
                      <td>
                        {cultureFilter
                          ? client.records
                              .filter((c) => c.culture == cultureFilter)
                              .reduce((acc, r) => parseFloat(r.result) + acc, 0)
                          : client.records.reduce(
                              (acc, r) => parseFloat(r.result) + acc,
                              0
                            )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <!-- <ul>
                {#each client.records as record, idx (record.id)}
                  <li>{record.date} - {record.result}</li>
                {/each}
              </ul> -->
            {:else}
              <p>Нет записей</p>
            {/if}
          </div>
        </details>
      </div>
    {/each}
  </div>

  <hr />

  <h5>Новый клиент:</h5>
  <form id="clientsForm">
    <label for="client">Имя клиента:</label>
    <input
      type="text"
      id="name"
      name="name"
      bind:value={name}
      inputmode="text"
      placeholder=""
      required
    />
    <label for="client">Телефон клиента:</label>
    <input
      type="text"
      id="telephone"
      name="telephone"
      bind:value={telephone}
      inputmode="text"
      placeholder=""
      required
    />
    <br />
    <button onclick={handleSaveClient}>Добавить Клиента</button>
  </form>
</div>

<style>
  .table {
    overflow: auto !important;
  }
  .clickable {
    cursor: pointer;
  }
</style>
