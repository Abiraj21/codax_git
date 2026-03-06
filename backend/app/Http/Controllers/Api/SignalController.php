<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Signal;
use Illuminate\Http\Request;

class SignalController extends Controller
{
    public function byAccount($id)
    {
        return response()->json(
            Signal::where('account_id', $id)
                ->where('status', 'active')
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
        return response()->json(Signal::create($validated), 201);
    }

    public function archive($id)
    {
        $signal = Signal::findOrFail($id);
        $signal->status = 'archived';
        $signal->save();
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
