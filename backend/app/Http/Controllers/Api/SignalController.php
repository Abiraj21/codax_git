<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SignalController extends Controller
{
    public function byAccount($id) {
        return Signal::where('account_id', $id)
                    ->where('status','active')
                    ->get();
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'account_id'=>'required|exists:accounts,id',
            'type'=>'required|string',
            'payload'=>'nullable|array'
        ]);
        return Signal::create($validated);
    }

    public function archive($id) {
        $signal = Signal::findOrFail($id);
        $signal->status = 'archived';
        $signal->save();
        return response()->json(['message'=>'Archived']);
    }

    public function filter(Request $request) {
        $query = Signal::query();
        if($request->type) $query->where('type', $request->type);
        if($request->status) $query->where('status', $request->status);
        return $query->get();
    }
}
