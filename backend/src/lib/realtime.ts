
import { supabase } from "./supabase.js";

export async function publishExpenseCreated(groupId: number) {
  const channel = supabase.channel(`group:${groupId}`);

  try {
    const status = await new Promise<string>((resolve) => {
      channel.subscribe((status) => {
        resolve(status);
      });
    });

    if (status !== "SUBSCRIBED") {
      throw new Error(`Realtime subscription failed: ${status}`);
    }

    const result = await channel.send({
      type: "broadcast",
      event: "EXPENSE_CREATED",
      payload: { groupId },
    });

    if (result !== "ok") {
      throw new Error(`Realtime broadcast failed: ${result}`);
    }
  } finally {
    await supabase.removeChannel(channel);
  }
}

export async function publishSettlement(groupId:number)
{
     const channel = supabase.channel(`group:${groupId}`);

  try {
    const status = await new Promise<string>((resolve) => {
      channel.subscribe((status) => {
        resolve(status);
      });
    });

    if (status !== "SUBSCRIBED") {
      throw new Error(`Realtime subscription failed: ${status}`);
    }

    const result = await channel.send({
      type: "broadcast",
      event: "SETTLEMENT",
      payload: { groupId },
    });

    if (result !== "ok") {
      throw new Error(`Realtime broadcast failed: ${result}`);
    }
  } finally {
    await supabase.removeChannel(channel);
  }
}
