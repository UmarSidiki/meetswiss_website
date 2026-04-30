export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    const nextWebhookUrl = process.env.NEXT_REVALIDATE_URL;
    const webhookSecret = process.env.REVALIDATE_WEBHOOK_SECRET;

    if (!nextWebhookUrl || !webhookSecret) {
      strapi.log.warn(
        '[revalidate] NEXT_REVALIDATE_URL or REVALIDATE_WEBHOOK_SECRET is not configured; ISR webhooks are disabled.'
      );
      return;
    }

    const modelsToRevalidate = new Set([
      'api::global.global',
      'api::page.page',
      'api::article.article',
      'api::service.service',
      'api::fleet.fleet',
      'api::blog-page.blog-page',
      'api::redirection.redirection',
    ]);

    const triggerRevalidate = async ({
      model,
      event,
      entry,
    }: {
      model: string;
      event: string;
      entry: Record<string, unknown>;
    }) => {
      if (!modelsToRevalidate.has(model)) {
        return;
      }

      try {
        const payload = {
          model: model.replace(/^api::/, '').split('.')[0],
          event,
          entry: {
            documentId: entry?.documentId,
            slug: entry?.slug,
          },
        };

        const response = await fetch(nextWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-revalidate-secret': webhookSecret,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const text = await response.text();
          strapi.log.error(
            `[revalidate] Failed for ${model} (${event}): ${response.status} ${text}`
          );
        }
      } catch (error) {
        strapi.log.error(
          `[revalidate] Error calling Next webhook for ${model} (${event}): ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    };

    strapi.db.lifecycles.subscribe({
      models: Array.from(modelsToRevalidate),
      async afterCreate(event) {
        await triggerRevalidate({
          model: event.model.uid,
          event: 'create',
          entry: event.result || {},
        });
      },
      async afterUpdate(event) {
        await triggerRevalidate({
          model: event.model.uid,
          event: 'update',
          entry: event.result || {},
        });
      },
      async afterDelete(event) {
        await triggerRevalidate({
          model: event.model.uid,
          event: 'delete',
          entry: event.result || {},
        });
      },
    });
  },
};
