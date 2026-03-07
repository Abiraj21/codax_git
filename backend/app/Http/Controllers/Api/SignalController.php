<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Signal;
use App\Events\SignalCreated;
use App\Events\SignalArchived;
use Illuminate\Http\Request;

class SignalController extends Controller
{
    public function byAccount($id)
    {
        return response()->json(
            Signal::where('account_id', $id)
                ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'type' => 'required|string',
            'status' => 'nullable|in:active,archived',
            'payload' => 'nullable|array',
        ]);
        $signal = Signal::create($validated);
        broadcast(new SignalCreated($signal));
        return response()->json($signal, 201);
    }

    public function archive($id)
    {
        $signal = Signal::findOrFail($id);
        $signal->status = 'archived';
        $signal->save();
        broadcast(new SignalArchived($signal));
        return response()->json(['message' => 'Archived']);
    }

    public function filter(Request $request)
    {
        $query = Signal::query();
        if ($request->type)
            $query->where('type', $request->type);
        if ($request->status)
            $query->where('status', $request->status);
        return response()->json($query->get());
    }
}
